import test from 'node:test';
import assert from 'node:assert/strict';
import { routeTurn } from '../src/dialog/router.js';

test('routes new session to welcome', () => {
  const decision = routeTurn({
    requestId: 'r1',
    sessionId: 's1',
    userId: 'u1',
    utterance: '',
    isNewSession: true,
    locale: 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: {},
  });

  assert.equal(decision.routeType, 'welcome');
});

test('routes help utterance to help', () => {
  const decision = routeTurn({
    requestId: 'r2',
    sessionId: 's1',
    userId: 'u1',
    utterance: 'помощь',
    isNewSession: false,
    locale: 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: {},
  });

  assert.equal(decision.routeType, 'help');
});

test('routes explanatory prompt to LLM', () => {
  const decision = routeTurn({
    requestId: 'r3',
    sessionId: 's1',
    userId: 'u1',
    utterance: 'объясни простыми словами что такое webhook',
    isNewSession: false,
    locale: 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: {},
  });

  assert.equal(decision.routeType, 'askLLM');
});

test('routes natural question to LLM by heuristic', () => {
  const decision = routeTurn({
    requestId: 'r4',
    sessionId: 's1',
    userId: 'u1',
    utterance: 'как выбрать хороший хостинг для голосового навыка',
    isNewSession: false,
    locale: 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: {},
  });

  assert.equal(decision.routeType, 'askLLM');
});

test('routes gibberish to fallback', () => {
  const decision = routeTurn({
    requestId: 'r5',
    sessionId: 's1',
    userId: 'u1',
    utterance: 'фывапролджэ',
    isNewSession: false,
    locale: 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: {},
  });

  assert.equal(decision.routeType, 'fallback');
});
