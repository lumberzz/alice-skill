#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3118}"
LOG_FILE="${LOG_FILE:-/tmp/alice-skill-rpc-trace.log}"

set -a
source .env
set +a
export OPENCLAW_RPC_TRACE=1

npm run dev > "$LOG_FILE" 2>&1 &
PID=$!
trap 'kill $PID >/dev/null 2>&1 || true' EXIT
sleep 2

curl -s -X POST "http://127.0.0.1:${PORT}/alice/webhook" \
  -H 'content-type: application/json' \
  --data '{"version":"1.0","session":{"new":false,"session_id":"rpc-trace","user_id":"rpc-user"},"request":{"command":"сделай ресерч по local transport и ответь очень кратко","original_utterance":"сделай ресерч по local transport и ответь очень кратко"},"meta":{"locale":"ru-RU"}}'

echo

echo '--- log ---'
cat "$LOG_FILE"
