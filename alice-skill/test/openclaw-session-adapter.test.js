import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionBasedOpenClawBridge } from '../src/services/openclaw/session-adapter.js';
import { MockOpenClawSessionInvoker } from '../src/services/openclaw/session-invoker.js';

test('session-based bridge resolves session and returns validated text', async () => {
  const bridge = new SessionBasedOpenClawBridge(new MockOpenClawSessionInvoker());
  const result = await bridge.run({
    taskType: 'research',
    utterance: 'сделай ресерч по webhook',
    sessionId: 'alice-session',
    userId: 'alice-user',
    timeoutMs: 1000,
    outputMode: 'voice-brief',
    safetyPolicy: {
      allowExternalActions: false,
      allowFileMutation: false,
      allowShell: false,
    },
  });

  assert.equal(result.status, 'ok');
  assert.match(result.text ?? '', /Mock session alice-worker:research:alice-user/i);
});
