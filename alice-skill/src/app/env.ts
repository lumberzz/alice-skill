import fs from 'node:fs';
import path from 'node:path';

export function loadDotEnv(envPath = path.join(process.cwd(), '.env'), override = false): void {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const text = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();

    if (override || !(key in process.env)) {
      process.env[key] = value;
    }
  }
}
