#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
APP_LOG="${APP_LOG:-/tmp/alice-skill-dev.log}"

npm run dev > "$APP_LOG" 2>&1 &
APP_PID=$!
trap 'kill $APP_PID >/dev/null 2>&1 || true' EXIT

sleep 2

PORT="$PORT" ./scripts/cloudflared-tunnel.sh
