# Alice Skill

Alice webhook backend with:
- thin Alice adapter
- deterministic router
- voice-first formatter
- mock or real LLM provider layer
- constrained OpenClaw bridge
- working persistent RPC transport via real `AgentSession + runRpcMode(session)`

## Deployment recommendation

For the **first real Alice end-to-end test**, the recommended path is:

- run locally
- expose with `cloudflared`
- use that public URL in Yandex Dialogs

Why not Render Free as the main path right now:
- it spins down after 15 minutes of idle time
- cold starts are a bad fit for Alice voice webhook UX
- the current project prefers a local long-lived RPC worker path
- local filesystem on free web services is ephemeral

Render is still possible later for a stateless or paid always-on deployment, but it is not the best first integration path for the current implementation.

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
-> Persistent RPC transport
-> real AgentSession
-> runRpcMode(session)
-> ReplyValidator
-> ResultNormalizer
-> voice response
```

## Run locally

```bash
npm install
cp .env.example .env
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
- `OPENCLAW_TRANSPORT` — `persistent-rpc`, `local-cli`, or `mock-rpc`
- `OPENCLAW_BINARY` — OpenClaw binary path, default `openclaw`
- `OPENCLAW_RPC_WORKER_SCRIPT` — worker script path for `persistent-rpc`
- `OPENCLAW_TEST_TIMEOUT_MS` — optional larger timeout for diagnostics
- `OPENROUTER_API_KEY` — OpenRouter key for embedded agent path
- `OPENROUTER_MODEL` — preferred registry-backed model, default `openai/gpt-5.4-mini`

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

### `persistent-rpc` (recommended for local testing)
Uses a long-lived local worker process that bootstraps a real `AgentSession` and enters `runRpcMode(session)`.
This is the preferred transport for local testing because it avoids per-request CLI startup cost and now supports real end-to-end replies.

### `local-cli`
Fallback real transport path using:

```bash
openclaw agent --local --json --session-id <derived> --timeout <seconds> --message <envelope>
```

### `mock-rpc`
Kept for isolated tests and architecture fallback.

## Result handling

OpenClaw results are normalized into voice-safe states:
- `ok`
- `timeout`
- `error`

OpenClaw spoken output is shortened to fit voice UX:
- at most 2 sentences
- otherwise hard-clamped length

## Checks

```bash
npm run typecheck
npm test
```

## Smoke tests

General smoke:

```bash
chmod +x scripts/smoke-openclaw.sh
PORT=3110 ./scripts/smoke-openclaw.sh
```

Budget-focused OpenClaw smoke:

```bash
chmod +x scripts/app-openclaw-budget-test.sh
PORT=3115 ./scripts/app-openclaw-budget-test.sh
```

RPC trace smoke:

```bash
chmod +x scripts/rpc-trace-test.sh
OPENCLAW_RPC_TRACE=1 PORT=3120 ./scripts/rpc-trace-test.sh
```

Provider check:

```bash
chmod +x scripts/provider-check.sh
./scripts/provider-check.sh
```

## Local public webhook via cloudflared

This is the recommended path for the first real Alice test.

For real Alice tests without a permanent server, run the app locally and expose it via cloudflared.

### 1. Start the app and tunnel

```bash
chmod +x scripts/cloudflared-tunnel.sh scripts/run-local-with-cloudflared.sh
PORT=3000 ./scripts/run-local-with-cloudflared.sh
```

If you already have the app running, start only the tunnel:

```bash
PORT=3000 ./scripts/cloudflared-tunnel.sh
```

### 2. Take the generated public URL

cloudflared will print a URL like:

```text
https://random-name.trycloudflare.com
```

Use this webhook in Yandex Dialogs:

```text
https://random-name.trycloudflare.com/alice/webhook
```

### 3. Quick local checks

```bash
curl http://127.0.0.1:3000/health
curl https://random-name.trycloudflare.com/health
```

## Current limitations

- runtime may still respond with a fallback registry-backed OpenRouter model instead of the requested preferred model
- `qwen/qwen3.6-plus:free` is not present in the current registry
- task mapping is intentionally narrow for safety
- current preferred OpenClaw path is local-first; hosted deployment needs a deliberate transport decision
