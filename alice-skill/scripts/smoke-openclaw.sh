#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3110}"
LOG_FILE="${LOG_FILE:-/tmp/alice-skill-smoke.log}"

npm run dev > "$LOG_FILE" 2>&1 &
PID=$!
trap 'kill $PID >/dev/null 2>&1 || true' EXIT

sleep 2

echo '--- health ---'
curl -s "http://127.0.0.1:${PORT}/health"
echo

echo '--- llm route ---'
curl -s -X POST "http://127.0.0.1:${PORT}/alice/webhook" \
  -H 'content-type: application/json' \
  --data '{"version":"1.0","session":{"new":false,"session_id":"smoke-llm","user_id":"smoke-user"},"request":{"command":"объясни кратко как работает webhook","original_utterance":"объясни кратко как работает webhook"},"meta":{"locale":"ru-RU"}}'
echo

echo '--- openclaw route ---'
curl -s -X POST "http://127.0.0.1:${PORT}/alice/webhook" \
  -H 'content-type: application/json' \
  --data '{"version":"1.0","session":{"new":false,"session_id":"smoke-openclaw","user_id":"smoke-user"},"request":{"command":"сделай ресерч по local transport","original_utterance":"сделай ресерч по local transport"},"meta":{"locale":"ru-RU"}}'
echo

echo '--- log ---'
cat "$LOG_FILE"
