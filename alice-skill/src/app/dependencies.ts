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
  llmStatus: {
    mode: 'mock' | 'configured' | 'misconfigured';
    apiUrl?: string;
    model: string;
    timeoutMs: number;
  };
}

function buildOpenClawEnv(config: ReturnType<typeof loadConfig>): NodeJS.ProcessEnv {
  const extraEnv: NodeJS.ProcessEnv = {};

  if (process.env.OPENROUTER_API_KEY) {
    extraEnv.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  }

  if (config.OPENROUTER_MODEL) {
    extraEnv.OPENROUTER_MODEL = config.OPENROUTER_MODEL;
  }

  return extraEnv;
}

export function createDependencies(): AppDependencies {
  const config = loadConfig();

  const llmApiUrl =
    config.LLM_API_URL || (process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1/chat/completions' : undefined);
  const llmApiKey = config.LLM_API_KEY || process.env.OPENROUTER_API_KEY;

  const llmProvider: LlmProvider =
    config.LLM_PROVIDER === 'openai-compatible' && llmApiUrl && llmApiKey
      ? new OpenAiCompatibleProvider({
          apiUrl: llmApiUrl,
          apiKey: llmApiKey,
          model: config.LLM_MODEL,
          timeoutMs: config.LLM_TIMEOUT_MS,
        })
      : new MockLlmProvider();

  const llmStatus = {
    mode:
      config.LLM_PROVIDER === 'mock'
        ? 'mock'
        : llmApiUrl && llmApiKey
          ? 'configured'
          : 'misconfigured',
    apiUrl: llmApiUrl,
    model: config.LLM_MODEL,
    timeoutMs: config.LLM_TIMEOUT_MS,
  } as const;

  const registry = new FileAliceSessionRegistry(path.join(process.cwd(), 'state', 'alice-session-registry.json'));
  const openclawEnv = buildOpenClawEnv(config);

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
        : new SessionBasedOpenClawBridge(
            new LocalCliSessionInvoker({
              binaryPath: config.OPENCLAW_BINARY,
              extraEnv: openclawEnv,
            }),
          );

  return {
    config,
    llmProvider,
    openclawBridge,
    llmStatus,
  };
}
