import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/app/config.js';

test('config defaults to persistent-rpc and modern openrouter model', () => {
  const config = loadConfig({});
  assert.equal(config.OPENCLAW_TRANSPORT, 'persistent-rpc');
  assert.equal(config.OPENROUTER_MODEL, 'openai/gpt-5.4-mini');
});
