# Alice Skill

Minimal Alice webhook backend with:
- thin Alice adapter
- deterministic router
- voice formatter
- mock/real LLM provider layer
- constrained OpenClaw bridge scaffold

## Run locally

```bash
npm install
npm run dev
```

Default port: `3000`

Health check:

```bash
curl http://127.0.0.1:3000/health
```

Sample webhook call:

```bash
curl -X POST http://127.0.0.1:3000/alice/webhook \
  -H 'content-type: application/json' \
  --data @fixtures/alice-new-session.json
```

## Environment

- `PORT` — HTTP port
- `LLM_PROVIDER` — `mock` or `openai-compatible`
- `LLM_API_URL` — compatible chat completions endpoint
- `LLM_API_KEY` — bearer token for provider
- `LLM_MODEL` — model name for provider

If real provider settings are incomplete, the app falls back to the mock LLM provider.

## Current routes

- welcome/help/capabilities
- askLLM
- askOpenClaw
- fallback

## Current OpenClaw bridge policy

Allowed mock task types:
- `research`
- `summary`
- `status`

Unsafe or unknown task types are rejected by policy.

Bridge contract currently includes:
- `sessionId`
- `userId`
- `timeoutMs`
- `outputMode`
- `safetyPolicy`

The current adapter shape is session-based:
- `TargetSessionResolver` chooses a dedicated Alice worker session key
- `TaskEnvelopeBuilder` creates a bounded voice-task message
- `SessionInvoker` sends the bounded request and waits for a reply
- `ReplyValidator` rejects empty, overly long, or internal-looking replies

OpenClaw results are normalized into a voice-safe form with statuses:
- `ok`
- `timeout`
- `error`

Timeouts degrade into short spoken fallback text instead of raw errors.

## Checks

```bash
npm run typecheck
npm test
```
