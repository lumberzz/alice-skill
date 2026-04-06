#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 https://<service>.onrender.com"
  exit 1
fi

BASE_URL="${1%/}"

echo "== health =="
curl -fsS "${BASE_URL}/health"
echo

echo "== alice webhook =="
curl -fsS -X POST "${BASE_URL}/alice/webhook" \
  -H 'content-type: application/json' \
  --data @fixtures/alice-new-session.json
echo
