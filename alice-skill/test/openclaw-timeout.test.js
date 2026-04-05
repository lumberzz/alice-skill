import test from 'node:test';
import assert from 'node:assert/strict';
import { withTimeout } from '../src/services/openclaw/timeout.js';

test('withTimeout resolves fallback on timeout', async () => {
  const result = await withTimeout(
    new Promise((resolve) => setTimeout(() => resolve('slow'), 50)),
    5,
    async () => 'fallback',
  );

  assert.equal(result, 'fallback');
});
