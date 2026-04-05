import test from 'node:test';
import assert from 'node:assert/strict';

import { readFileSync } from 'node:fs';

test('persistent rpc manager source includes partial-on-timeout fallback', () => {
  const source = readFileSync(new URL('../src/services/openclaw/persistent-local-rpc-worker-manager.ts', import.meta.url), 'utf8');
  assert.match(source, /latestAssistantText/);
  assert.match(source, /type: 'turn_end'/);
});
