import type { OpenClawTaskType } from './permissions.js';

export interface OpenClawSafetyPolicy {
  allowExternalActions: boolean;
  allowFileMutation: boolean;
  allowShell: boolean;
}

export interface OpenClawBridgeInput {
  taskType: OpenClawTaskType;
  utterance: string;
  sessionId: string;
  userId: string;
  timeoutMs: number;
  outputMode: 'voice-brief' | 'structured-summary';
  safetyPolicy: OpenClawSafetyPolicy;
}

export interface OpenClawBridgeResult {
  status: 'ok' | 'timeout' | 'error';
  text?: string;
  details?: string;
  errorMessage?: string;
  source: 'mock-openclaw';
  latencyMs: number;
}

export interface OpenClawBridge {
  run(input: OpenClawBridgeInput): Promise<OpenClawBridgeResult>;
}

export class MockOpenClawBridge implements OpenClawBridge {
  async run(input: OpenClawBridgeInput): Promise<OpenClawBridgeResult> {
    const startedAt = Date.now();

    if (input.timeoutMs < 50) {
      return {
        status: 'timeout',
        source: 'mock-openclaw',
        latencyMs: Date.now() - startedAt,
        errorMessage: 'timeout budget too small',
      };
    }

    return {
      status: 'ok',
      source: 'mock-openclaw',
      latencyMs: Date.now() - startedAt,
      text: `Mock OpenClaw обработал задачу типа ${input.taskType}: ${input.utterance}`,
      details: `outputMode=${input.outputMode}`,
    };
  }
}
