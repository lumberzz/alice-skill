import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/app/config.js';

test('loadConfig falls back to defaults', () => {
  const config = loadConfig({});
  assert.equal(config.LLM_PROVIDER, 'mock');
  assert.equal(config.PORT, 3000);
});
