import { loadConfig } from './config.js';
import type { LlmProvider } from '../services/llm/provider.js';
import { MockLlmProvider } from '../services/llm/mock-provider.js';
import { OpenAiCompatibleProvider } from '../services/llm/openai-compatible-provider.js';
import type { OpenClawBridge } from '../services/openclaw/bridge.js';
import { MockOpenClawBridge } from '../services/openclaw/bridge.js';

export interface AppDependencies {
  config: ReturnType<typeof loadConfig>;
  llmProvider: LlmProvider;
  openclawBridge: OpenClawBridge;
}

export function createDependencies(): AppDependencies {
  const config = loadConfig();

  const llmProvider: LlmProvider =
    config.LLM_PROVIDER === 'openai-compatible' && config.LLM_API_URL && config.LLM_API_KEY
      ? new OpenAiCompatibleProvider({
          apiUrl: config.LLM_API_URL,
          apiKey: config.LLM_API_KEY,
          model: config.LLM_MODEL,
        })
      : new MockLlmProvider();

  return {
    config,
    llmProvider,
    openclawBridge: new MockOpenClawBridge(),
  };
}
