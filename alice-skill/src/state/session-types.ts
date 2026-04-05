export interface SessionState {
  scene: string | null;
  lastIntent: string | null;
  shortSummary: string | null;
  pendingQuestion: string | null;
  pendingConfirmation: string | null;
  updatedAt: string;
}

export function createEmptySessionState(): SessionState {
  return {
    scene: null,
    lastIntent: null,
    shortSummary: null,
    pendingQuestion: null,
    pendingConfirmation: null,
    updatedAt: new Date().toISOString(),
  };
}
