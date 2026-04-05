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

  const remainingBudgetMs = context.deadlineAt - Date.now() - 150;

  if (remainingBudgetMs < 100) {
    const normalized = normalizeOpenClawResult({
      status: 'timeout',
      source: 'mock-openclaw',
      latencyMs: Math.max(0, remainingBudgetMs),
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

  const timeoutMs = remainingBudgetMs;

  const result = await withTimeout(
    bridge.run({
      taskType,
      utterance: context.utterance,
      sessionId: context.sessionId,
      userId: context.userId,
      timeoutMs,
      outputMode: 'voice-brief',
      safetyPolicy: {
        allowExternalActions: false,
        allowFileMutation: false,
        allowShell: false,
      },
    }),
    timeoutMs,
    async () => ({
      status: 'timeout' as const,
      source: 'mock-openclaw' as const,
      latencyMs: timeoutMs,
      errorMessage: 'bridge timeout',
    }),
  );

  const normalized = normalizeOpenClawResult(result);

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
