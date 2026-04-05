import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { OpenClawBridgeResult } from './bridge.js';
import type { OpenClawSessionInvokeInput, OpenClawSessionInvoker } from './session-invoker.js';
import { classifyOpenClawCliError, summarizeOpenClawCliError } from './error-mapping.js';

const execFileAsync = promisify(execFile);

interface OpenClawAgentJsonResult {
  reply?: {
    text?: string;
  };
  message?: string;
  text?: string;
}

export class LocalCliSessionInvoker implements OpenClawSessionInvoker {
  constructor(private readonly binaryPath = 'openclaw') {}

  async invoke(input: OpenClawSessionInvokeInput): Promise<OpenClawBridgeResult> {
    const startedAt = Date.now();
    const sessionId = this.deriveSessionId(input.sessionKey);
    const timeoutSeconds = Math.max(1, Math.ceil(input.timeoutMs / 1000));

    try {
      const { stdout, stderr } = await execFileAsync(
        this.binaryPath,
        [
          'agent',
          '--local',
          '--json',
          '--session-id',
          sessionId,
          '--timeout',
          String(timeoutSeconds),
          '--message',
          input.message,
        ],
        {
          cwd: process.cwd(),
          timeout: input.timeoutMs,
          maxBuffer: 1024 * 1024,
        },
      );

      const parsed = JSON.parse(stdout) as OpenClawAgentJsonResult;
      const text = parsed.reply?.text ?? parsed.message ?? parsed.text;

      if (!text) {
        return {
          status: 'error',
          source: 'mock-openclaw',
          latencyMs: Date.now() - startedAt,
          errorMessage: summarizeOpenClawCliError(stderr || 'openclaw local cli returned no text'),
        };
      }

      return {
        status: 'ok',
        source: 'mock-openclaw',
        latencyMs: Date.now() - startedAt,
        text,
        details: sessionId,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        status: classifyOpenClawCliError(message),
        source: 'mock-openclaw',
        latencyMs: Date.now() - startedAt,
        errorMessage: summarizeOpenClawCliError(message),
      };
    }
  }

  private deriveSessionId(sessionKey: string): string {
    const slug = sessionKey.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48);
    const digest = crypto.createHash('sha1').update(sessionKey).digest('hex').slice(0, 12);
    return `alice-${slug}-${digest}`;
  }
}
