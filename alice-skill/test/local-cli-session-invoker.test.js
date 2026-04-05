import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalCliSessionInvoker } from '../src/services/openclaw/local-cli-session-invoker.js';

test('local cli session invoker derives stable session ids', () => {
  const invoker = new LocalCliSessionInvoker('openclaw');
  const a = invoker['deriveSessionId']('alice-worker:research:user-1');
  const b = invoker['deriveSessionId']('alice-worker:research:user-1');
  const c = invoker['deriveSessionId']('alice-worker:research:user-2');

  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^alice-/);
});
