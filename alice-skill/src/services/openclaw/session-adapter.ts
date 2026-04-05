import type { OpenClawBridge, OpenClawBridgeInput, OpenClawBridgeResult } from './bridge.js';
import { resolveOpenClawSessionTarget } from './session-resolver.js';
import { buildOpenClawTaskEnvelope } from './envelope.js';
import { validateOpenClawReply } from './reply-validator.js';
import type { OpenClawSessionInvoker } from './session-invoker.js';

export class SessionBasedOpenClawBridge implements OpenClawBridge {
  constructor(private readonly invoker: OpenClawSessionInvoker) {}

  async run(input: OpenClawBridgeInput): Promise<OpenClawBridgeResult> {
    const target = resolveOpenClawSessionTarget(input.taskType, input.userId);
    const message = buildOpenClawTaskEnvelope(input, target);
    const result = await this.invoker.invoke({
      sessionKey: target.sessionKey,
      message,
      timeoutMs: input.timeoutMs,
    });

    if (result.status !== 'ok') {
      return result;
    }

    const validation = validateOpenClawReply(result.text);
    if (!validation.ok) {
      return {
        status: 'error',
        source: result.source,
        latencyMs: result.latencyMs,
        errorMessage: `reply validation failed: ${validation.reason}`,
      };
    }

    return {
      ...result,
      text: validation.text,
    };
  }
}
