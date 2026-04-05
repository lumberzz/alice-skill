import test from 'node:test';
import assert from 'node:assert/strict';
import { RpcEventCollector } from '../src/services/openclaw/rpc-event-collector.js';

test('collector extracts assistant text from message_update partials', () => {
  const collector = new RpcEventCollector();
  collector.push({
    type: 'message_update',
    assistantMessageEvent: {
      partial: {
        role: 'assistant',
        content: [{ type: 'text', text: 'На месте' }],
      },
    },
  });
  collector.push({
    type: 'turn_end',
    message: {
      role: 'assistant',
      content: [{ type: 'text', text: 'На месте' }],
    },
  });

  const result = collector.getResult();
  assert.equal(result.completed, true);
  assert.equal(result.text, 'На месте');
});
