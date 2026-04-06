import type { LlmGenerateInput, LlmGenerateOutput, LlmProvider } from './provider.js';
import { buildVoicePrompt } from './prompts.js';

interface OpenAiCompatibleProviderOptions {
  apiUrl: string;
  apiKey: string;
  model: string;
  timeoutMs?: number;
}

export class OpenAiCompatibleProvider implements LlmProvider {
  constructor(private readonly options: OpenAiCompatibleProviderOptions) {}

  async generateSpokenAnswer(input: LlmGenerateInput): Promise<LlmGenerateOutput> {
    const controller = new AbortController();
    const timeoutMs = this.options.timeoutMs ?? 6000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const prompt = buildVoicePrompt(input);

    try {
      const response = await fetch(this.options.apiUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.options.apiKey}`,
        },
        body: JSON.stringify({
          model: this.options.model,
          temperature: 0.4,
          max_tokens: 140,
          messages: [
            { role: 'system', content: 'Ты голосовой помощник. Отвечай коротко, ясно и естественно по-русски.' },
            { role: 'user', content: prompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => '');
        throw new Error(`LLM request failed with status ${response.status}${responseText ? `: ${responseText.slice(0, 300)}` : ''}`);
      }

      const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) {
        throw new Error('LLM response did not include text content');
      }

      return {
        provider: 'openai-compatible',
        text,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
