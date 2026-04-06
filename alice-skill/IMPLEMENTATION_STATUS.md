# Alice Skill Implementation Status

## Current state
- Alice webhook backend is implemented and routable.
- Deterministic routes exist for welcome/help/capabilities/LLM/OpenClaw/fallback.
- LLM mock and OpenAI-compatible scaffolding exist.
- OpenClaw integration has three transport modes: local-cli, mock-rpc, persistent-rpc.
- Persistent-rpc is the preferred test transport and is now end-to-end capable with real AgentSession + runRpcMode(session).
- Reply collection from real RPC streaming is fixed and returns real assistant replies.
- Worker bootstrap now prefers modern registry-backed models, with `openai/gpt-5.4-mini` as default.
- `qwen/qwen3.6-plus:free` is not present in the current registry and therefore is not selected.
- Voice formatting for OpenClaw responses has been improved.

## Remaining work toward first testable version
1. Verify clean end-to-end smoke with preferred persistent-rpc default.
2. Finalize README and helper scripts around the chosen default path.
3. Clean up transient diagnostics and create milestone commits.

## Deployment direction decided
- First choice in principle was local run + cloudflared.
- In the current network environment, tunnel connectivity is blocked or unreliable.
- Therefore the active rollout path is now a Render-hosted demo deployment.
- Render Free is still only a demo path because idle spin-down and cold starts are a poor fit for Alice webhook UX.
- Hosted production deployment still needs a deliberate transport strategy.

## Definition of first testable working version
- Alice webhook starts locally.
- askLLM route works.
- askOpenClaw route works through persistent-rpc.
- End-to-end smoke demonstrates a real assistant reply.
- Project has README, scripts, tests, and a stable transport default suitable for local testing.
