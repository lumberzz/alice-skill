import type { TurnContext } from '../types/turn-context.js';

export interface RequestContext extends TurnContext {
  startedAt: number;
  deadlineAt: number;
}

export function withRequestContext(turn: TurnContext, timeoutMs = 4000): RequestContext {
  const startedAt = Date.now();
  return {
    ...turn,
    startedAt,
    deadlineAt: startedAt + timeoutMs,
  };
}
