import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/app/config.js';

test('loadConfig provides default OpenRouter model', () => {
  const config = loadConfig({});
  assert.equal(config.OPENROUTER_MODEL, 'openai/gpt-5.4-mini');
});
