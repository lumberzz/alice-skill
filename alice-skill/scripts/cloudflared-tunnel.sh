#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared is not installed"
  exit 1
fi

echo "Starting cloudflared tunnel for http://127.0.0.1:${PORT}"
echo "Use the generated public URL with path /alice/webhook in Yandex Dialogs."

action_url() {
  if command -v stdbuf >/dev/null 2>&1; then
    stdbuf -oL -eL cloudflared tunnel --url "http://127.0.0.1:${PORT}" 2>&1 | tee /tmp/alice-skill-cloudflared.log
  else
    cloudflared tunnel --url "http://127.0.0.1:${PORT}" 2>&1 | tee /tmp/alice-skill-cloudflared.log
  fi
}

action_url
