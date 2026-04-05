export interface LlmGenerateInput {
  utterance: string;
  shortSummary?: string | null;
  locale: string;
}

export interface LlmGenerateOutput {
  text: string;
  provider: string;
}

export interface LlmProvider {
  generateSpokenAnswer(input: LlmGenerateInput): Promise<LlmGenerateOutput>;
}
