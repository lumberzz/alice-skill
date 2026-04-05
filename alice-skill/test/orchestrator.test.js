import test from 'node:test';
import assert from 'node:assert/strict';
import { orchestrateTurn } from '../src/dialog/orchestrator.js';
import { MemorySessionStore } from '../src/state/memory-store.js';
import { MockLlmProvider } from '../src/services/llm/mock-provider.js';
import { MockOpenClawBridge } from '../src/services/openclaw/bridge.js';

test('orchestrator routes LLM requests', async () => {
  const response = await orchestrateTurn(
    {
      requestId: 'r6',
      sessionId: 's6',
      userId: 'u6',
      utterance: 'расскажи кратко про alice webhook',
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
      openclawBridge: new MockOpenClawBridge(),
    },
  );

  assert.equal(response.meta?.route, 'askLLM');
});

test('orchestrator routes research requests to OpenClaw', async () => {
  const response = await orchestrateTurn(
    {
      requestId: 'r7',
      sessionId: 's7',
      userId: 'u7',
      utterance: 'сделай ресерч по webhook',
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
      openclawBridge: new MockOpenClawBridge(),
    },
  );

  assert.equal(response.meta?.route, 'askOpenClaw');
});
