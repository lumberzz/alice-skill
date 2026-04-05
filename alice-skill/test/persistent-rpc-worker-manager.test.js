import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { PersistentLocalRpcWorkerManager } from '../src/services/openclaw/persistent-local-rpc-worker-manager.js';

test('persistent rpc worker manager can start worker and exchange commands', async () => {
  const workerScript = path.join(process.cwd(), 'scripts', 'openclaw-rpc-worker.js');
  const manager = new PersistentLocalRpcWorkerManager(process.execPath, [workerScript]);
  const client = await manager.ensureStarted();
  const response = await client.send({ id: 't1', type: 'get_state' });

  assert.equal(response.success, true);
  assert.ok(response.data);

  manager.dispose();
});
