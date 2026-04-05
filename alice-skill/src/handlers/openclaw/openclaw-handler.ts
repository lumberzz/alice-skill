import type { RequestContext } from '../../middleware/request-context.js';
import type { SkillResponse } from '../../types/skill-response.js';
import type { OpenClawBridge } from '../../services/openclaw/bridge.js';
import { isAllowedTaskType } from '../../services/openclaw/permissions.js';
import { normalizeOpenClawResult } from '../../services/openclaw/normalizer.js';
import { withTimeout } from '../../services/openclaw/timeout.js';

export async function openclawHandler(
  context: RequestContext,
  bridge: OpenClawBridge,
  taskType: string,
): Promise<SkillResponse> {
  if (!isAllowedTaskType(taskType)) {
    return {
      text: 'Такой тип агентной задачи сейчас не разрешён голосом.',
    };
  }

  const configuredTimeoutMs = Number(process.env.OPENCLAW_TEST_TIMEOUT_MS || 0);
  const remainingBudgetMs = context.deadlineAt - Date.now() - 150;
  const effectiveTimeoutMs = configuredTimeoutMs > 0 ? configuredTimeoutMs : remainingBudgetMs;

  console.log(JSON.stringify({
    event: 'openclaw_budget',
    sessionId: context.sessionId,
    taskType,
    remainingBudgetMs,
    configuredTimeoutMs: configuredTimeoutMs || null,
    effectiveTimeoutMs,
  }));

  if (effectiveTimeoutMs < 100) {
    const normalized = normalizeOpenClawResult({
      status: 'timeout',
      source: 'mock-openclaw',
      latencyMs: Math.max(0, effectiveTimeoutMs),
      errorMessage: 'insufficient remaining budget',
    });

    return {
      text: normalized.briefText,
      meta: {
        openclawSource: normalized.source,
        openclawTaskType: taskType,
        openclawStatus: normalized.status,
        openclawLatencyMs: normalized.latencyMs,
      },
    };
  }

  const result = await withTimeout(
    bridge.run({
      taskType,
      utterance: context.utterance,
      sessionId: context.sessionId,
      userId: context.userId,
      timeoutMs: effectiveTimeoutMs,
      outputMode: 'voice-brief',
      safetyPolicy: {
        allowExternalActions: false,
        allowFileMutation: false,
        allowShell: false,
      },
    }),
    effectiveTimeoutMs,
    async () => ({
      status: 'timeout' as const,
      source: 'mock-openclaw' as const,
      latencyMs: effectiveTimeoutMs,
      errorMessage: 'bridge timeout',
    }),
  );

  console.log(JSON.stringify({
    event: 'openclaw_bridge_result',
    sessionId: context.sessionId,
    taskType,
    status: result.status,
    latencyMs: result.latencyMs,
    hasText: Boolean(result.text),
    errorMessage: result.errorMessage ?? null,
  }));

  const normalized = normalizeOpenClawResult(result);

  console.log(JSON.stringify({
    event: 'openclaw_normalized_result',
    sessionId: context.sessionId,
    taskType,
    status: normalized.status,
    latencyMs: normalized.latencyMs,
    briefTextPreview: normalized.briefText.slice(0, 120),
  }));

  return {
    text: normalized.briefText,
    meta: {
      openclawSource: normalized.source,
      openclawTaskType: taskType,
      openclawStatus: normalized.status,
      openclawLatencyMs: normalized.latencyMs,
    },
  };
}
