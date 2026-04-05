import type { OpenClawBridgeResult } from './bridge.js';

export interface OpenClawSessionInvokeInput {
  sessionKey: string;
  message: string;
  timeoutMs: number;
}

export interface OpenClawSessionInvoker {
  invoke(input: OpenClawSessionInvokeInput): Promise<OpenClawBridgeResult>;
}

export class MockOpenClawSessionInvoker implements OpenClawSessionInvoker {
  async invoke(input: OpenClawSessionInvokeInput): Promise<OpenClawBridgeResult> {
    const startedAt = Date.now();

    if (input.timeoutMs < 50) {
      return {
        status: 'timeout',
        source: 'mock-openclaw',
        latencyMs: Date.now() - startedAt,
        errorMessage: 'session invoker timeout',
      };
    }

    return {
      status: 'ok',
      source: 'mock-openclaw',
      latencyMs: Date.now() - startedAt,
      text: `Mock session ${input.sessionKey} вернула краткий ответ по задаче.`,
      details: input.message,
    };
  }
}
