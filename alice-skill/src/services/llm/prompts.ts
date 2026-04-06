import type { LlmGenerateInput } from './provider.js';

export function buildVoicePrompt(input: LlmGenerateInput): string {
  return [
    'Ответь по-русски кратко и естественно для голосового ассистента.',
    'Максимум 2 коротких предложения.',
    'Сразу отвечай по сути, без вступлений и без списков.',
    'Избегай кавычек, markdown, канцелярита и лишних оговорок.',
    'Если тема сложная, объясни простыми словами на одном понятном примере.',
    input.shortSummary ? `Краткий контекст: ${input.shortSummary}` : null,
    `Запрос пользователя: ${input.utterance}`,
  ]
    .filter(Boolean)
    .join('\n');
}
