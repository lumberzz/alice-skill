import type { RequestContext } from '../../middleware/request-context.js';
import type { SkillResponse } from '../../types/skill-response.js';
import type { OpenClawBridge } from '../../services/openclaw/bridge.js';
import { isAllowedTaskType } from '../../services/openclaw/permissions.js';
import { normalizeOpenClawResult } from '../../services/openclaw/normalizer.js';

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

  const result = await bridge.run({
    taskType,
    utterance: context.utterance,
  });

  return {
    text: normalizeOpenClawResult(result),
    meta: {
      openclawSource: result.source,
      openclawTaskType: taskType,
    },
  };
}
