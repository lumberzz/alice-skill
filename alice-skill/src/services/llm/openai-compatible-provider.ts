import type { LlmGenerateInput, LlmGenerateOutput, LlmProvider } from './provider.js';
import { buildVoicePrompt } from './prompts.js';

interface OpenAiCompatibleProviderOptions {
  apiUrl: string;
  apiKey: string;
  model: string;
}

export class OpenAiCompatibleProvider implements LlmProvider {
  constructor(private readonly options: OpenAiCompatibleProviderOptions) {}

  async generateSpokenAnswer(input: LlmGenerateInput): Promise<LlmGenerateOutput> {
    const prompt = buildVoicePrompt(input);
    const response = await fetch(this.options.apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.options.apiKey}`,
      },
      body: JSON.stringify({
        model: this.options.model,
        messages: [
          { role: 'system', content: 'Ты голосовой помощник. Отвечай коротко и ясно.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM request failed with status ${response.status}`);
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
  }
}
