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

test('formatter prefers cutting at word boundary when possible', () => {
  const response = formatVoiceResponse({
    text: 'Webhook — это способ, при котором один сервис уведомляет другой о событии автоматически. Это удобно для интеграций между приложениями и помогает не опрашивать API вручную каждые несколько секунд без необходимости.'.repeat(2),
  });

  assert.ok(response.text.length <= 220);
  assert.match(response.text, /…$/);
  assert.ok(
    response.text.endsWith('.…') || response.text.endsWith('!…') || response.text.endsWith('?…') || response.text.endsWith(' …'),
  );
});
