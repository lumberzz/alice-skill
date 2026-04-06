#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
LOG_FILE="${CLOUDFLARED_LOG:-/tmp/alice-skill-cloudflared.log}"
CLOUDFLARED_PROTOCOL="${CLOUDFLARED_PROTOCOL:-http2}"
CLOUDFLARED_DISABLE_PROXY="${CLOUDFLARED_DISABLE_PROXY:-1}"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared is not installed"
  exit 1
fi

echo "Starting cloudflared tunnel for http://127.0.0.1:${PORT}"
echo "Protocol: ${CLOUDFLARED_PROTOCOL}"
echo "Disable proxy env: ${CLOUDFLARED_DISABLE_PROXY}"
echo "Log file: ${LOG_FILE}"
echo "Use the generated public URL with path /alice/webhook in Yandex Dialogs."

if [ "${CLOUDFLARED_DISABLE_PROXY}" = "1" ]; then
  CMD=(env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy cloudflared tunnel --protocol "${CLOUDFLARED_PROTOCOL}" --url "http://127.0.0.1:${PORT}")
else
  CMD=(cloudflared tunnel --protocol "${CLOUDFLARED_PROTOCOL}" --url "http://127.0.0.1:${PORT}")
fi

if command -v stdbuf >/dev/null 2>&1; then
  stdbuf -oL -eL "${CMD[@]}" 2>&1 | tee "${LOG_FILE}"
else
  "${CMD[@]}" 2>&1 | tee "${LOG_FILE}"
fi
