import test from 'node:test';
import assert from 'node:assert/strict';
import { formatVoiceResponse } from '../src/formatter/voice-formatter.js';

test('formatter trims and limits response length', () => {
  const response = formatVoiceResponse({
    text: 'x'.repeat(260),
  });

  assert.ok(response.text.length <= 220);
  assert.equal(response.tts, response.text);
});
