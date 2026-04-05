import type { SessionStore } from './store.js';
import type { SessionState } from './session-types.js';

export class MemorySessionStore implements SessionStore {
  private readonly sessions = new Map<string, SessionState>();

  get(sessionId: string): SessionState | null {
    return this.sessions.get(sessionId) ?? null;
  }

  set(sessionId: string, state: SessionState): void {
    this.sessions.set(sessionId, state);
  }

  clear(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
