import path from 'node:path';
import type { LlmProvider } from '../services/llm/provider.js';
import { MockLlmProvider } from '../services/llm/mock-provider.js';
import { OpenAiCompatibleProvider } from '../services/llm/openai-compatible-provider.js';
import type { OpenClawBridge } from '../services/openclaw/bridge.js';
import { SessionBasedOpenClawBridge } from '../services/openclaw/session-adapter.js';
import { LocalCliSessionInvoker } from '../services/openclaw/local-cli-session-invoker.js';
import { LocalRpcSessionInvoker } from '../services/openclaw/local-rpc-session-invoker.js';
import { MockLocalRpcWorkerManager } from '../services/openclaw/local-rpc-worker-manager.js';
import { FileAliceSessionRegistry } from '../services/openclaw/alice-session-registry.js';
import { PersistentLocalRpcWorkerManager } from '../services/openclaw/persistent-local-rpc-worker-manager.js';
import { loadConfig } from './config.js';

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

  const registry = new FileAliceSessionRegistry(path.join(process.cwd(), 'state', 'alice-session-registry.json'));

  const openclawBridge =
    config.OPENCLAW_TRANSPORT === 'mock-rpc'
      ? new SessionBasedOpenClawBridge(
          new LocalRpcSessionInvoker(new MockLocalRpcWorkerManager(), registry),
        )
      : config.OPENCLAW_TRANSPORT === 'persistent-rpc'
        ? new SessionBasedOpenClawBridge(
            new LocalRpcSessionInvoker(
              new PersistentLocalRpcWorkerManager(process.execPath, [config.OPENCLAW_RPC_WORKER_SCRIPT]),
              registry,
            ),
          )
        : new SessionBasedOpenClawBridge(new LocalCliSessionInvoker(config.OPENCLAW_BINARY));

  return {
    config,
    llmProvider,
    openclawBridge,
  };
}
