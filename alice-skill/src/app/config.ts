import path from 'node:path';
import { z } from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  LLM_PROVIDER: z.enum(['mock', 'openai-compatible']).default('mock'),
  LLM_API_URL: z.string().url().optional(),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default('gpt-4.1-mini'),
  OPENCLAW_TRANSPORT: z.enum(['local-cli', 'mock-rpc', 'persistent-rpc']).default('local-cli'),
  OPENCLAW_BINARY: z.string().default('openclaw'),
  OPENCLAW_RPC_WORKER_SCRIPT: z.string().default(path.join(process.cwd(), 'scripts', 'openclaw-rpc-worker.js')),
});

export type AppConfig = z.infer<typeof configSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return configSchema.parse(env);
}
