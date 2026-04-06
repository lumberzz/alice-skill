# Render Notes

## Status
Render is **not** the recommended first deployment path for this project.

Primary reason:
- Render Free spins down on idle, which is a poor fit for Alice webhook responsiveness.

## What this file is for
This is a fallback/demo deployment note in case we still want to publish a temporary hosted version.

## Safe expectation for Render Free
A Render Free deployment is suitable only for:
- basic HTTP demo of the webhook
- health checks
- testing fixed routes
- very light validation of the app shape

It is **not** a good fit for:
- reliable Alice voice UX
- always-warm responses
- long-lived local worker assumptions
- persistent local filesystem state

## Included render.yaml behavior
The provided `render.yaml` intentionally uses:
- `OPENCLAW_TRANSPORT=mock-rpc`
- `LLM_PROVIDER=mock`

That keeps the hosted demo stateless and avoids depending on local OpenClaw runtime behavior that is natural on the laptop but not guaranteed on Render.

## If we later decide to use Render seriously
Prefer one of these:
1. paid always-on web service
2. transport redesign for hosted stateless execution
3. separate hosted webhook + remote agent/backend architecture

## Account note
Actually deploying to Render requires a registered Render account connected to a Git repository.
