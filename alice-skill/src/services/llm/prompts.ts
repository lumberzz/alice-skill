import type { LlmGenerateInput } from './provider.js';

export function buildVoicePrompt(input: LlmGenerateInput): string {
  return [
    'Ответь по-русски кратко и естественно для голосового ассистента.',
    'Не используй длинные вступления, канцелярит и длинные списки.',
    'Одна главная мысль, максимум 2-3 коротких предложения.',
    input.shortSummary ? `Краткий контекст: ${input.shortSummary}` : null,
    `Запрос пользователя: ${input.utterance}`,
  ]
    .filter(Boolean)
    .join('\n');
}
