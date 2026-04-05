export interface TurnContext {
  requestId: string;
  sessionId: string;
  userId: string;
  utterance: string;
  isNewSession: boolean;
  locale: string;
  source: 'alice';
  timestamp: string;
  raw: unknown;
}
