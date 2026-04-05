import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOpenClawResult } from '../src/services/openclaw/normalizer.js';

test('normalizer maps timeout result to voice-safe brief text', () => {
  const normalized = normalizeOpenClawResult({
    status: 'timeout',
    source: 'mock-openclaw',
    latencyMs: 2500,
  });

  assert.equal(normalized.status, 'timeout');
  assert.match(normalized.briefText, /не успела быстро/i);
});

test('normalizer preserves ok result text', () => {
  const normalized = normalizeOpenClawResult({
    status: 'ok',
    source: 'mock-openclaw',
    latencyMs: 15,
    text: '  test   result  ',
    details: '  more details ',
  });

  assert.equal(normalized.status, 'ok');
  assert.equal(normalized.briefText, 'test result');
  assert.equal(normalized.detailsText, 'more details');
});
