import { aliceRequestSchema, type AliceRequest } from './schema.js';
import type { TurnContext } from '../types/turn-context.js';

export function parseAliceRequest(input: unknown): AliceRequest {
  return aliceRequestSchema.parse(input);
}

export function toTurnContext(request: AliceRequest): TurnContext {
  const utterance = request.request.command || request.request.original_utterance || '';

  return {
    requestId: crypto.randomUUID(),
    sessionId: request.session.session_id,
    userId: request.session.user_id,
    utterance,
    isNewSession: request.session.new,
    locale: request.meta?.locale ?? 'ru-RU',
    source: 'alice',
    timestamp: new Date().toISOString(),
    raw: request,
  };
}
