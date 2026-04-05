import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { LocalRpcSessionInvoker } from '../src/services/openclaw/local-rpc-session-invoker.js';
import { MockLocalRpcWorkerManager } from '../src/services/openclaw/local-rpc-worker-manager.js';
import { FileAliceSessionRegistry } from '../src/services/openclaw/alice-session-registry.js';

test('local rpc session invoker creates session mapping and returns assistant reply', async () => {
  const registryPath = path.join(os.tmpdir(), `alice-registry-${Date.now()}.json`);
  const invoker = new LocalRpcSessionInvoker(
    new MockLocalRpcWorkerManager(),
    new FileAliceSessionRegistry(registryPath),
  );

  const result = await invoker.invoke({
    sessionKey: 'alice-worker:research:test-user',
    message: 'test message',
    timeoutMs: 1000,
  });

  assert.equal(result.status, 'ok');
  assert.match(result.text ?? '', /Mock RPC worker/i);
  assert.ok(fs.existsSync(registryPath));
});
