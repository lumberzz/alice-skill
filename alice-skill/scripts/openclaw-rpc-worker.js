#!/usr/bin/env node
import path from 'node:path';
import { createAgentSession } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/sdk.js';
import { runRpcMode } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/modes/rpc/rpc-mode.js';
import { ModelRegistry } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/model-registry.js';
import { AuthStorage } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/auth-storage.js';
import { SessionManager } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js';

const preferredModelIds = [
  process.env.OPENROUTER_MODEL,
  'openai/gpt-5.4-mini',
  'openai/gpt-5.1-codex',
].filter(Boolean);

const agentDir = process.env.PI_AGENT_DIR || path.join(process.env.HOME || '', '.pi', 'agent');

let model;
let authStorage;
let modelRegistry;

try {
  authStorage = AuthStorage.create(path.join(agentDir, 'auth.json'));
  modelRegistry = ModelRegistry.create(authStorage, path.join(agentDir, 'models.json'));
} catch (error) {
  console.error(`Failed to initialize auth/model registry: ${error instanceof Error ? error.message : String(error)}`);
}

if (modelRegistry) {
  try {
    const availableModels = modelRegistry.getAll();
    for (const modelId of preferredModelIds) {
      const candidate = availableModels.find((entry) => entry.id === modelId);
      if (candidate) {
        model = candidate;
        break;
      }
    }

    if (!model && preferredModelIds.length > 0) {
      console.error(`Preferred models not found in registry: ${preferredModelIds.join(', ')}`);
    }
  } catch (error) {
    console.error(`Failed to resolve configured model: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const { session, modelFallbackMessage } = await createAgentSession({
  cwd: process.cwd(),
  agentDir,
  authStorage,
  modelRegistry,
  model,
  sessionManager: SessionManager.inMemory(process.cwd()),
});

if (model) {
  console.error(`Worker selected model candidate: ${model.provider}/${model.id}`);
}

if (modelFallbackMessage) {
  console.error(modelFallbackMessage);
}

await runRpcMode(session);
