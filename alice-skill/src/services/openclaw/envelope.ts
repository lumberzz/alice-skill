import type { OpenClawBridgeInput } from './bridge.js';
import type { ResolvedOpenClawSessionTarget } from './session-resolver.js';

export function buildOpenClawTaskEnvelope(
  input: OpenClawBridgeInput,
  target: ResolvedOpenClawSessionTarget,
): string {
  return [
    'Ты backend-слой голосового интерфейса Алисы.',
    `Тип задачи: ${input.taskType}.`,
    `Целевая worker-session: ${target.sessionKey}.`,
    `Пользовательский запрос: ${input.utterance}`,
    'Ограничения:',
    '- ответ максимум 2-3 коротких предложения',
    '- без markdown и длинных списков',
    '- без внешних действий',
    '- без shell, записи и удаления файлов',
    '- если задача слишком большая, верни только краткую суть',
    `Требуемый режим ответа: ${input.outputMode}.`,
    'Верни только итоговый краткий ответ для озвучки.',
  ].join('\n');
}
