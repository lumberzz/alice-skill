# Alice Skill Implementation Plan

## Goal
Build a non-forked Alice skill webhook backend with a thin Alice adapter, deterministic routing, voice-first formatting, optional LLM integration, and a constrained OpenClaw bridge.

## Sprint 1 — Protocol edge + app skeleton
- Create isolated project directory for the Alice skill service
- Add package manifest and TypeScript config
- Add HTTP server with `POST /alice/webhook` and `GET /health`
- Add Alice request/response schemas and mappers
- Add normalized `TurnContext` and `SkillResponse`
- Return a static valid Alice response

Acceptance criteria:
- Local server starts
- `/health` returns OK
- `/alice/webhook` accepts a sample Alice payload and returns valid response JSON

## Sprint 2 — Core pipeline
- Add middleware chain concept
- Add request logging and timeout budget
- Add dialog orchestrator
- Add deterministic router
- Add fixed handlers: welcome/help/capabilities/fallback
- Add voice formatter

Acceptance criteria:
- New session gets welcome response
- Known intents hit fixed handlers
- Unknown requests hit fallback
- All responses pass through formatter

## Sprint 3 — State + tests
- Add session state store interface
- Add in-memory implementation
- Add scene-ready state shape
- Add unit tests for mapper/router/formatter
- Add sample payload fixtures

Acceptance criteria:
- Session state persists across local requests in process
- Core logic has automated tests

## Sprint 4 — LLM integration
- Add provider interface
- Add mock provider and optional real provider env hooks
- Add llm handler
- Add prompt policy for concise voice answers
- Add timeout/fallback behavior

Acceptance criteria:
- Open-ended route can return LLM-backed answer
- Timeouts degrade gracefully

## Sprint 5 — OpenClaw bridge
- Add constrained bridge interface
- Add permissions policy and allowed task types
- Add result normalizer
- Add dedicated route to invoke bridge for safe tasks only

Acceptance criteria:
- Allowed tasks execute through bridge adapter
- Disallowed tasks are rejected with safe voice response

## Sprint 6 — Verification and deployment prep
- Add structured config/env handling
- Add smoke script with sample request
- Add lint/typecheck/test scripts
- Document local run and Alice webhook setup

Acceptance criteria:
- Project can be run, checked, and explained clearly

## Initial implementation choice
Start now with Sprint 1 + enough of Sprint 2 to have a meaningful internal architecture:
- TypeScript project skeleton
- Alice adapter
- TurnContext/SkillResponse
- orchestrator
- deterministic router
- fixed handlers
- formatter
- health endpoint

## Deferred for later
- account linking
- persistent state store
- production observability stack
- real LLM provider wiring
- real OpenClaw bridge wiring
