import test from 'node:test';
import assert from 'node:assert/strict';
import { llmHandler } from '../src/handlers/llm/llm-handler.js';
import { MockLlmProvider } from '../src/services/llm/mock-provider.js';
import { createEmptySessionState } from '../src/state/session-types.js';

test('llm handler returns mock provider response', async () => {
  const response = await llmHandler(
    {
      requestId: 'r3',
      sessionId: 's1',
      userId: 'u1',
      utterance: 'расскажи кратко про интеграцию',
      isNewSession: false,
      locale: 'ru-RU',
      source: 'alice',
      timestamp: new Date().toISOString(),
      raw: {},
      startedAt: Date.now(),
      deadlineAt: Date.now() + 3000,
    },
    new MockLlmProvider(),
    createEmptySessionState(),
  );

  assert.match(response.text, /mock-ответ LLM/i);
});
