import test from 'node:test';
import assert from 'node:assert/strict';
import { llmHandler } from '../src/handlers/llm/llm-handler.js';
import { createEmptySessionState } from '../src/state/session-types.js';

test('llm handler degrades gracefully on provider error', async () => {
  const response = await llmHandler(
    {
      requestId: 'r-llm-err',
      sessionId: 's-llm-err',
      userId: 'u-llm-err',
      utterance: 'объясни квантовую запутанность простыми словами',
      isNewSession: false,
      locale: 'ru-RU',
      source: 'alice',
      timestamp: new Date().toISOString(),
      raw: {},
      startedAt: Date.now(),
      deadlineAt: Date.now() + 3000,
    },
    {
      async generateSpokenAnswer() {
        throw new Error('provider boom');
      },
    },
    createEmptySessionState(),
  );

  assert.match(response.text, /не получилось получить ответ/i);
  assert.equal(response.meta?.llmStatus, 'error');
});
