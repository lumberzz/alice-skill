import { MockLlmProvider } from '../services/llm/mock-provider.js';

export const dependencies = {
  llmProvider: new MockLlmProvider(),
};
