#!/usr/bin/env bash
set -euo pipefail

node --import tsx --input-type=module <<'EOF'
import { loadDotEnv } from './src/app/env.ts';
import { createAgentSession } from '/home/lumber/.nvm/versions/node/v24.14.1/lib/node_modules/openclaw/node_modules/@mariozechner/pi-coding-agent/dist/core/sdk.js';

loadDotEnv('./.env', true);

const { session, modelFallbackMessage } = await createAgentSession({ cwd: process.cwd() });
console.log(JSON.stringify({
  hasSession: !!session,
  modelFallbackMessage,
  openrouterModel: process.env.OPENROUTER_MODEL,
  hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
}, null, 2));
EOF
