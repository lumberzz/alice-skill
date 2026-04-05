import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAliceRequest, toTurnContext } from '../src/alice/mapper.js';

test('parseAliceRequest and toTurnContext normalize payload', () => {
  const parsed = parseAliceRequest({
    version: '1.0',
    session: {
      new: false,
      session_id: 's-map',
      user_id: 'u-map',
    },
    request: {
      command: 'помощь',
      original_utterance: 'помощь',
    },
    meta: {
      locale: 'ru-RU',
    },
  });

  const turn = toTurnContext(parsed);
  assert.equal(turn.sessionId, 's-map');
  assert.equal(turn.userId, 'u-map');
  assert.equal(turn.utterance, 'помощь');
  assert.equal(turn.locale, 'ru-RU');
});
