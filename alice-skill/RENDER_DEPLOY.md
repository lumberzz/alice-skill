# Render Demo Deployment

## Goal
Deploy a **demo** version of `alice-skill` to Render so it has a public HTTPS URL for Yandex Dialogs testing.

This path is intentionally **stateless** and **demo-only**.

## Important limitations
This Render deployment is for:
- public webhook URL
- health checks
- fixed deterministic routes
- very light app validation

This Render deployment is **not** for:
- reliable always-warm Alice production use
- local persistent OpenClaw runtime
- persistent filesystem state
- long-lived local worker assumptions

## Required account
You need a **registered Render account** connected to a Git repository.

## Current deployment profile
The included Render demo config uses:
- `LLM_PROVIDER=mock`
- `OPENCLAW_TRANSPORT=mock-rpc`

This keeps the deployment simple and stateless.

## Files prepared for this path
- `render.yaml`
- `.env.render-demo.example`
- `RENDER_NOTES.md`

## Before deploying
Make sure the repository is available from GitHub (or another Git provider supported by Render).

If this workspace is only local right now, the next step is:
1. create a GitHub repository
2. push this workspace or at least the `alice-skill` project there
3. connect that repository in Render

## Option A: Blueprint deploy from render.yaml
If Render detects `render.yaml`, it can create the service from that file.

Current config:
- service type: `web`
- runtime: `node`
- rootDir: `alice-skill`
- plan: `free`
- build: `npm ci && npm run build`
- start: `npm start`

## Option B: Manual service creation in Render UI
If you create the service manually, use:

- **Type:** Web Service
- **Runtime:** Node
- **Root Directory:** `alice-skill`
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

### Environment variables
Set these in Render:

- `PORT=10000`
- `LLM_PROVIDER=mock`
- `OPENCLAW_TRANSPORT=mock-rpc`
- `OPENROUTER_MODEL=openai/gpt-5.4-mini`

You can also copy from `.env.render-demo.example`.

### Enabling a real LLM later
When you want the hosted skill to answer through a real LLM, switch to:

- `LLM_PROVIDER=openai-compatible`
- `LLM_MODEL=openai/gpt-5.4-mini` (or another compatible model)

And provide one of these auth/config paths:

1. explicit compatible endpoint:
   - `LLM_API_URL=<compatible chat completions endpoint>`
   - `LLM_API_KEY=<token>`

2. OpenRouter shortcut:
   - `OPENROUTER_API_KEY=<token>`

If `OPENROUTER_API_KEY` is present and `LLM_API_URL` is empty, the app will automatically use:
- `https://openrouter.ai/api/v1/chat/completions`

## Expected behavior after deploy
### Health check
Render service root health endpoint:

```text
https://<your-render-service>.onrender.com/health
```

Expected JSON shape:

```json
{
  "ok": true,
  "service": "alice-skill",
  "llmProvider": "mock",
  "openclawTransport": "mock-rpc"
}
```

### Alice webhook URL
Use this in Yandex Dialogs:

```text
https://<your-render-service>.onrender.com/alice/webhook
```

## Suggested first smoke checks
1. Open `/health`
2. Send sample webhook payload to `/alice/webhook`
3. Confirm fixed responses work
4. Only then point Yandex Dialogs to the webhook

## Example manual webhook test
```bash
curl -X POST https://<your-render-service>.onrender.com/alice/webhook \
  -H 'content-type: application/json' \
  --data @fixtures/alice-new-session.json
```

## What to expect from free Render
- service may sleep after idle
- first request after idle may be slow
- acceptable for demo, not great for voice UX

## Best next step after demo works
If the demo proves the webhook path, then choose one of:
1. paid always-on Render service
2. VPS / other host
3. hosted stateless webhook + separate remote agent backend
