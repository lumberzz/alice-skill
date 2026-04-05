import path from 'node:path';
import { loadConfig } from './config.js';
import type { LlmProvider } from '../services/llm/provider.js';
import { MockLlmProvider } from '../services/llm/mock-provider.js';
import { OpenAiCompatibleProvider } from '../services/llm/openai-compatible-provider.js';
import type { OpenClawBridge } from '../services/openclaw/bridge.js';
import { SessionBasedOpenClawBridge } from '../services/openclaw/session-adapter.js';
import { LocalRpcSessionInvoker } from '../services/openclaw/local-rpc-session-invoker.js';
import { MockLocalRpcWorkerManager } from '../services/openclaw/local-rpc-worker-manager.js';
import { FileAliceSessionRegistry } from '../services/openclaw/alice-session-registry.js';

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

  const registry = new FileAliceSessionRegistry(
    path.join(process.cwd(), 'state', 'alice-session-registry.json'),
  );

  return {
    config,
    llmProvider,
    openclawBridge: new SessionBasedOpenClawBridge(
      new LocalRpcSessionInvoker(new MockLocalRpcWorkerManager(), registry),
    ),
  };
}
