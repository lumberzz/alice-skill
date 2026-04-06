# Alice Skill Deployment Decision

## Decision
For the **first real Alice end-to-end test**, use **local run + cloudflared tunnel**.

Do **not** use **Render free** as the primary path for this phase.

## Why this is the best current option

### Render free is not a good fit for Alice voice UX
Render free web services:
- spin down after 15 minutes of idle time
- take about a minute to spin back up
- have ephemeral local filesystem
- do not provide free background workers

For a voice assistant webhook, cold starts after idle are a bad fit.

### Current project shape also favors local-first testing
The current `alice-skill` implementation:
- defaults to `OPENCLAW_TRANSPORT=persistent-rpc`
- includes a long-lived local RPC worker path
- uses a file-backed Alice session registry
- was already moving toward a `cloudflared`-based real webhook test flow

That makes local + tunnel the shortest path to a real integration test without prematurely redesigning transport for a hosted stateless environment.

## What Render is still good for
Render can still be useful later for:
- a temporary demo deployment
- a stateless HTTP-only version of the webhook
- a paid always-on deployment

If hosted deployment becomes the next goal, prefer:
- Render Starter or another always-on host
- only after deciding how hosted OpenClaw access should work

## Current recommendation
1. Run `alice-skill` locally
2. Expose it with `cloudflared`
3. Put the public URL into Yandex Dialogs
4. Validate real Alice webhook behavior
5. Only then decide whether to productize on paid Render / VPS / another host
