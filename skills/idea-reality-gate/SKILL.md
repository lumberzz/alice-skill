---
name: idea-reality-gate
description: Evaluate new product, startup, bot, MCP, CLI, SaaS, or greenfield app ideas before recommending implementation. Use when someone asks whether an idea already exists, whether the market is crowded, whether it is worth building, who competitors are, or how to differentiate. Trigger on requests to validate an idea, scan competitors, check market saturation, compare against existing tools, or decide whether to build, pivot, or drop a new concept.
---

# Idea Reality Gate

Use this skill as a pre-build market sanity check.

## Core behavior

Before recommending implementation of a **new product concept**, run an idea-reality check first.

Treat these as strong triggers:
- new startup idea
- new bot, MCP, CLI, agent, SaaS, app, or platform concept
- "has anyone built this already?"
- "is the market crowded?"
- "should I build this?"
- "who are the competitors?"
- "how should I pivot or differentiate?"

Do **not** use this skill for:
- routine feature work inside an existing project
- bugfixes, refactors, migrations, or infra tasks
- deep business due diligence where this tool would be only one weak signal

## Required workflow

1. Normalize the idea into one clear sentence if the user phrased it loosely.
2. Run the MCP tool `idea_check`.
3. Choose depth:
   - `quick` for a fast sanity check
   - `deep` when the user asks for competitor scan, market analysis, saturation, niche finding, or build/pivot/drop guidance
4. Summarize the result in plain language.
5. Make a recommendation:
   - `build` when competition looks manageable and the idea still appears viable
   - `pivot` when competition is strong but there is room for differentiation
   - `drop` when the space appears crowded and no clear niche is visible
6. If the signal is high, avoid jumping straight to implementation advice. Discuss differentiation first.

## Decision guide

Use this as a heuristic, not a rigid rule:

- `0-30` → relatively open space
  - Say the space looks relatively open
  - Warn that low competition can also mean low demand
  - Suggest lightweight validation, then planning

- `31-60` → moderate competition
  - Say the market is not empty
  - Recommend narrowing the ICP, workflow, or niche
  - Prefer `pivot` unless the user already has a sharp differentiator

- `61-100` → high competition
  - Say the space is crowded
  - Do not recommend "just build it" by default
  - Focus on differentiation, wedge, integration angle, or adjacent niche
  - Prefer `pivot`, occasionally `drop`

## Output format

Default to this structure:

- **Idea**: normalized one-line description
- **Reality signal**: score + duplicate likelihood + trend
- **What exists already**: 2-5 strongest competitors or evidence points
- **Verdict**: build / pivot / drop
- **Why**: short explanation tied to the score and evidence
- **Best next step**: concrete next move

## Response style

- Be direct, not dramatic
- Do not pretend the score is ground truth
- Treat the tool as an early market sensor, not a full analyst
- If the evidence is mixed, say so explicitly
- If the user asks for implementation after a high score, first propose a narrower angle

## Example recommendation patterns

### Low signal

"The space looks relatively open. That is good, but it can also mean weak demand. I would do one small validation pass, then move to a scoped MVP."

### Mid signal

"There is already activity here, so a generic version is unlikely to stand out. I would narrow the target user or workflow before building."

### High signal

"This space is already crowded. I would not build a broad version head-on. The better move is to pick a narrower wedge, an integration angle, or a neglected user segment."
