import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadDotEnv } from '../src/app/env.js';

test('loadDotEnv loads env vars from file when absent', () => {
  const envPath = path.join(os.tmpdir(), `alice-skill-env-${Date.now()}.env`);
  fs.writeFileSync(envPath, 'OPENROUTER_API_KEY=test-key\n');
  delete process.env.OPENROUTER_API_KEY;

  loadDotEnv(envPath);

  assert.equal(process.env.OPENROUTER_API_KEY, 'test-key');
});

test('loadDotEnv can override existing env vars', () => {
  const envPath = path.join(os.tmpdir(), `alice-skill-env-override-${Date.now()}.env`);
  fs.writeFileSync(envPath, 'OPENROUTER_MODEL=override-model\n');
  process.env.OPENROUTER_MODEL = 'old-model';

  loadDotEnv(envPath, true);

  assert.equal(process.env.OPENROUTER_MODEL, 'override-model');
});
