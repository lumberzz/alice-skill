import test from 'node:test';
import assert from 'node:assert/strict';
import { orchestrateTurn } from '../src/dialog/orchestrator.js';
import { MemorySessionStore } from '../src/state/memory-store.js';
import { MockLlmProvider } from '../src/services/llm/mock-provider.js';
import { MockOpenClawBridge } from '../src/services/openclaw/bridge.js';

test('orchestrator returns controlled fallback when LLM mode is misconfigured', async () => {
  const response = await orchestrateTurn(
    {
      requestId: 'r-misconfigured',
      sessionId: 's-misconfigured',
      userId: 'u-misconfigured',
      utterance: 'объясни что такое webhook',
      isNewSession: false,
      locale: 'ru-RU',
      source: 'alice',
      timestamp: new Date().toISOString(),
      raw: {},
      startedAt: Date.now(),
      deadlineAt: Date.now() + 3000,
    },
    {
      sessionStore: new MemorySessionStore(),
      llmProvider: new MockLlmProvider(),
      llmStatus: { mode: 'misconfigured', model: 'openai/gpt-5.4-mini', timeoutMs: 6000 },
      openclawBridge: new MockOpenClawBridge(),
    },
  );

  assert.match(response.text, /провайдер ещё не настроен/i);
  assert.equal(response.meta?.route, 'askLLM');
});
