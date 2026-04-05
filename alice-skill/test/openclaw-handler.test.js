import test from 'node:test';
import assert from 'node:assert/strict';
import { openclawHandler } from '../src/handlers/openclaw/openclaw-handler.js';
import { MockOpenClawBridge } from '../src/services/openclaw/bridge.js';

test('openclaw handler allows safe task types', async () => {
  const response = await openclawHandler(
    {
      requestId: 'r4',
      sessionId: 's4',
      userId: 'u4',
      utterance: 'сделай краткий ресерч',
      isNewSession: false,
      locale: 'ru-RU',
      source: 'alice',
      timestamp: new Date().toISOString(),
      raw: {},
      startedAt: Date.now(),
      deadlineAt: Date.now() + 3000,
    },
    new MockOpenClawBridge(),
    'research',
  );

  assert.match(response.text, /Mock OpenClaw/i);
});

test('openclaw handler rejects unsafe task types', async () => {
  const response = await openclawHandler(
    {
      requestId: 'r5',
      sessionId: 's5',
      userId: 'u5',
      utterance: 'удали всё',
      isNewSession: false,
      locale: 'ru-RU',
      source: 'alice',
      timestamp: new Date().toISOString(),
      raw: {},
      startedAt: Date.now(),
      deadlineAt: Date.now() + 3000,
    },
    new MockOpenClawBridge(),
    'delete-all',
  );

  assert.match(response.text, /не разрешён голосом/i);
});
