#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 https://<service>.onrender.com"
  exit 1
fi

BASE_URL="${1%/}"
TMP_PAYLOAD="$(mktemp)"
trap 'rm -f "$TMP_PAYLOAD"' EXIT

cat > "$TMP_PAYLOAD" <<'JSON'
{
  "version": "1.0",
  "session": {
    "new": false,
    "session_id": "render-llm-session",
    "user_id": "render-llm-user"
  },
  "request": {
    "command": "объясни простыми словами, что такое webhook",
    "original_utterance": "объясни простыми словами, что такое webhook"
  },
  "meta": {
    "locale": "ru-RU"
  }
}
JSON

echo "== health =="
curl -fsS "${BASE_URL}/health"
echo

echo "== llm webhook =="
curl -fsS -X POST "${BASE_URL}/alice/webhook" \
  -H 'content-type: application/json' \
  --data @"$TMP_PAYLOAD"
echo
