import type { OpenClawBridgeResult } from './bridge.js';

export interface NormalizedOpenClawResult {
  status: 'ok' | 'timeout' | 'error';
  briefText: string;
  detailsText?: string;
  source: 'openclaw';
  latencyMs: number;
}

export function normalizeOpenClawResult(result: OpenClawBridgeResult): NormalizedOpenClawResult {
  if (result.status === 'timeout') {
    return {
      status: 'timeout',
      source: 'openclaw',
      latencyMs: result.latencyMs,
      briefText: 'Я не успела быстро получить ответ от агентного слоя.',
    };
  }

  if (result.status === 'error') {
    return {
      status: 'error',
      source: 'openclaw',
      latencyMs: result.latencyMs,
      briefText: 'При обработке агентной задачи что-то пошло не так.',
    };
  }

  const cleanedText = (result.text ?? 'OpenClaw не вернул содержательный ответ.')
    .replace(/\s+/g, ' ')
    .trim();

  const sentenceSplit = cleanedText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const briefText = sentenceSplit.length > 2
    ? sentenceSplit.slice(0, 2).join(' ')
    : cleanedText.length > 240
      ? `${cleanedText.slice(0, 237).trim()}…`
      : cleanedText;

  const detailsText = result.details?.replace(/\s+/g, ' ').trim();

  return {
    status: 'ok',
    source: 'openclaw',
    latencyMs: result.latencyMs,
    briefText,
    detailsText,
  };
}
