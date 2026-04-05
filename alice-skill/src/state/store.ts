import type { SessionState } from './session-types.js';

export interface SessionStore {
  get(sessionId: string): SessionState | null;
  set(sessionId: string, state: SessionState): void;
  clear(sessionId: string): void;
}
