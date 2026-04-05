# Alice Skill

Alice webhook backend with:
- thin Alice adapter
- deterministic router
- voice-first formatter
- mock or real LLM provider layer
- constrained OpenClaw bridge
- real local OpenClaw transport via `openclaw agent --local --json`

## Current architecture

```text
Alice webhook
-> Alice adapter
-> request context + routing
-> fixed handlers | LLM handler | OpenClaw handler
-> voice formatter
-> Alice response
```

OpenClaw path:

```text
askOpenClaw
-> SessionBasedOpenClawBridge
-> TargetSessionResolver
-> TaskEnvelopeBuilder
-> LocalCliSessionInvoker
-> openclaw agent --local --json
-> ReplyValidator
-> ResultNormalizer
-> voice response
```

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

### HTTP
- `PORT` — HTTP port

### LLM
- `LLM_PROVIDER` — `mock` or `openai-compatible`
- `LLM_API_URL` — compatible chat completions endpoint
- `LLM_API_KEY` — bearer token for provider
- `LLM_MODEL` — model name for provider

### OpenClaw
- `OPENCLAW_TRANSPORT` — `local-cli`, `mock-rpc`, or `persistent-rpc`
- `OPENCLAW_BINARY` — OpenClaw binary path, default `openclaw`
- `OPENCLAW_RPC_WORKER_SCRIPT` — worker script path for `persistent-rpc`

If real LLM provider settings are incomplete, the app falls back to the mock LLM provider.

## Current routes

- `welcome`
- `help`
- `capabilities`
- `askLLM`
- `askOpenClaw`
- `fallback`

## OpenClaw bridge policy

Allowed task types:
- `research`
- `summary`
- `status`

Unsafe or unknown task types are rejected by policy.

Bridge contract includes:
- `sessionId`
- `userId`
- `timeoutMs`
- `outputMode`
- `safetyPolicy`

## Transport notes

### `local-cli`
First real transport path.
Uses:

```bash
openclaw agent --local --json --session-id <derived> --timeout <seconds> --message <envelope>
```

This is the recommended current transport because it is already available and supported locally.

### `mock-rpc`
Keeps the session-oriented RPC scaffolding in place for future work on a persistent worker transport.

### `persistent-rpc`
Prototype transport for a long-lived local worker process speaking a simple JSONL RPC protocol.
Current version is a process-backed prototype with a dedicated worker script, meant for latency experiments and architecture validation.

## Result handling

OpenClaw results are normalized into voice-safe states:
- `ok`
- `timeout`
- `error`

Timeouts and transport errors degrade into short spoken fallback text instead of raw internal errors.

## Checks

```bash
npm run typecheck
npm test
```

## Smoke test

```bash
chmod +x scripts/smoke-openclaw.sh
PORT=3110 ./scripts/smoke-openclaw.sh
```

## Current limitations

- `local-cli` transport spawns a fresh OpenClaw CLI process per request
- `persistent-rpc` is still a prototype worker path, not yet wired to real `runRpcMode(session)`
- reply extraction from local CLI is intentionally conservative
- OpenClaw task mapping is still narrow by design
