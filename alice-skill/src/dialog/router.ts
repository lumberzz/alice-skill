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
  /зачем/i,
  /для чего/i,
  /кто такой/i,
  /кто такая/i,
  /как работает/i,
  /как устроен/i,
  /как использовать/i,
  /в чем разница/i,
  /чем отличается/i,
  /что значит/i,
  /что означает/i,
  /какой смысл/i,
  /можешь объяснить/i,
  /на простом примере/i,
  /простыми словами/i,
  /в двух словах/i,
];
const SMALLTALK_PATTERNS = [/привет/i, /здравствуй/i, /как дела/i];
const QUESTION_HINT_PATTERNS = [
  /\?$/,
  /^как\b/i,
  /^почему\b/i,
  /^зачем\b/i,
  /^что\b/i,
  /^кто\b/i,
  /^где\b/i,
  /^когда\b/i,
  /^можно ли\b/i,
  /^чем\b/i,
  /^какой\b/i,
  /^какая\b/i,
  /^какие\b/i,
];

function normalizeUtterance(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .trim();
}

function looksLikeGibberish(input: string): boolean {
  const cleaned = input.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
  if (cleaned.length < 3) {
    return true;
  }

  if (/^(.)\1{3,}$/i.test(cleaned)) {
    return true;
  }

  return /^(фыва|asdf|qwer|йцук|1234|абвг)/i.test(cleaned);
}

function looksLikeNaturalQuestion(input: string): boolean {
  if (QUESTION_HINT_PATTERNS.some((pattern) => pattern.test(input))) {
    return true;
  }

  const words = input.split(' ').filter(Boolean);
  return words.length >= 4 && input.length >= 18;
}

export function routeTurn(context: TurnContext): RouteDecision {
  const utterance = normalizeUtterance(context.utterance);

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
    return { routeType: 'askLLM', confidence: 0.82, reason: 'llm-pattern' };
  }

  if (!looksLikeGibberish(utterance) && looksLikeNaturalQuestion(utterance)) {
    return { routeType: 'askLLM', confidence: 0.68, reason: 'llm-natural-question-heuristic' };
  }

  return { routeType: 'fallback', confidence: 0.4, reason: 'no-deterministic-match' };
}
