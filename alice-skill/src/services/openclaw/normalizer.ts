import type { OpenClawBridgeResult } from './bridge.js';

export function normalizeOpenClawResult(result: OpenClawBridgeResult): string {
  return result.text.replace(/\s+/g, ' ').trim();
}
