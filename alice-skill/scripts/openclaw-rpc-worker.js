#!/usr/bin/env node
import { createAgentSession } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/sdk.js';
import { runRpcMode } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/modes/rpc/rpc-mode.js';

const { session, modelFallbackMessage } = await createAgentSession({
  cwd: process.cwd(),
});

if (modelFallbackMessage) {
  console.error(modelFallbackMessage);
}

await runRpcMode(session);
