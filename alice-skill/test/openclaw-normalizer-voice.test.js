import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOpenClawResult } from '../src/services/openclaw/normalizer.js';

test('normalizer limits openclaw brief text for voice', () => {
  const normalized = normalizeOpenClawResult({
    status: 'ok',
    source: 'mock-openclaw',
    latencyMs: 10,
    text: 'Первое предложение. Второе предложение. Третье предложение. Четвёртое предложение.',
  });

  assert.equal(normalized.briefText, 'Первое предложение. Второе предложение.');
});
