import type { LlmGenerateInput, LlmGenerateOutput, LlmProvider } from './provider.js';
import { buildVoicePrompt } from './prompts.js';

export class MockLlmProvider implements LlmProvider {
  async generateSpokenAnswer(input: LlmGenerateInput): Promise<LlmGenerateOutput> {
    const _prompt = buildVoicePrompt(input);
    const trimmed = input.utterance.trim();

    return {
      provider: 'mock',
      text: trimmed
        ? `Пока это mock-ответ LLM на запрос: ${trimmed}. Следующий шаг — подключить реального провайдера и сохранить тот же интерфейс.`
        : 'Пока это mock-ответ LLM без содержательного запроса.',
    };
  }
}
