import type { TurnContext } from '../types/turn-context.js';
import type { RouteDecision } from './route-types.js';

const HELP_PATTERNS = [/помощь/i, /что ты умеешь/i, /help/i];
const CAPABILITIES_PATTERNS = [/возможности/i, /что умеешь/i, /capabilities/i];
const OPENCLAW_PATTERNS = [/ресерч/i, /исследуй/i, /сделай summary/i, /сводку/i, /статус/i];
const LLM_PATTERNS = [
  /объясни/i,
  /расскажи/i,
  /кратко/i,
  /что такое/i,
  /почему/i,
  /кто такой/i,
  /кто такая/i,
  /как работает/i,
  /что значит/i,
  /в двух словах/i,
];
const SMALLTALK_PATTERNS = [/привет/i, /здравствуй/i, /как дела/i];

export function routeTurn(context: TurnContext): RouteDecision {
  const utterance = context.utterance.trim();

  if (context.isNewSession || utterance.length === 0) {
    return { routeType: 'welcome', confidence: 1, reason: 'new-session-or-empty' };
  }

  if (HELP_PATTERNS.some((pattern) => pattern.test(utterance))) {
    return { routeType: 'help', confidence: 0.98, reason: 'help-pattern' };
  }

  if (CAPABILITIES_PATTERNS.some((pattern) => pattern.test(utterance))) {
    return { routeType: 'capabilities', confidence: 0.92, reason: 'capabilities-pattern' };
  }

  if (SMALLTALK_PATTERNS.some((pattern) => pattern.test(utterance))) {
    return { routeType: 'welcome', confidence: 0.8, reason: 'smalltalk-pattern' };
  }

  if (OPENCLAW_PATTERNS.some((pattern) => pattern.test(utterance))) {
    return { routeType: 'askOpenClaw', confidence: 0.78, reason: 'openclaw-pattern' };
  }

  if (LLM_PATTERNS.some((pattern) => pattern.test(utterance))) {
    return { routeType: 'askLLM', confidence: 0.74, reason: 'llm-pattern' };
  }

  return { routeType: 'fallback', confidence: 0.4, reason: 'no-deterministic-match' };
}
