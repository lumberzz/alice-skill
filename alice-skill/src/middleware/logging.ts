export function logTurnStart(payload: Record<string, unknown>): void {
  console.log(JSON.stringify({ event: 'turn_start', ...payload }));
}

export function logTurnEnd(payload: Record<string, unknown>): void {
  console.log(JSON.stringify({ event: 'turn_end', ...payload }));
}

export function logTurnError(payload: Record<string, unknown>): void {
  console.error(JSON.stringify({ event: 'turn_error', ...payload }));
}
