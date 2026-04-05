import crypto from 'node:crypto';
import type { OpenClawBridgeResult } from './bridge.js';
import type { OpenClawSessionInvokeInput, OpenClawSessionInvoker } from './session-invoker.js';
import type { AliceSessionRegistry } from './alice-session-registry.js';
import type { LocalRpcWorkerManager } from './local-rpc-worker-manager.js';
import { RpcEventCollector } from './rpc-event-collector.js';

export class LocalRpcSessionInvoker implements OpenClawSessionInvoker {
  constructor(
    private readonly workerManager: LocalRpcWorkerManager,
    private readonly registry: AliceSessionRegistry,
  ) {}

  async invoke(input: OpenClawSessionInvokeInput): Promise<OpenClawBridgeResult> {
    const startedAt = Date.now();
    const client = await this.workerManager.ensureStarted();

    let sessionPath = await this.registry.resolve(input.sessionKey);

    if (!sessionPath) {
      await client.send({ id: crypto.randomUUID(), type: 'new_session' });
      await client.send({ id: crypto.randomUUID(), type: 'set_session_name', name: input.sessionKey });
      const state = await client.send({ id: crypto.randomUUID(), type: 'get_state' });
      sessionPath = String(state.data?.sessionFile ?? `/tmp/${input.sessionKey}.jsonl`);
      await this.registry.save(input.sessionKey, sessionPath);
    }

    await client.send({ id: crypto.randomUUID(), type: 'switch_session', sessionPath });

    const collector = new RpcEventCollector();
    const collected = await client.sendAndCollect(
      { id: crypto.randomUUID(), type: 'prompt', message: input.message },
      input.timeoutMs,
    );

    for (const event of collected.events) {
      collector.push(event);
    }

    const result = collector.getResult();
    if (!result.completed || !result.text) {
      return {
        status: 'error',
        source: 'mock-openclaw',
        latencyMs: Date.now() - startedAt,
        errorMessage: 'no assistant reply collected from rpc worker',
      };
    }

    return {
      status: 'ok',
      source: 'mock-openclaw',
      latencyMs: Date.now() - startedAt,
      text: result.text,
      details: sessionPath,
    };
  }
}
