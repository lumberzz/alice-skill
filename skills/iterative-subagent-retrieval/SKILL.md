---
name: iterative-subagent-retrieval
description: Staged subagent workflow for OpenClaw. Use on complex tasks where a worker should not receive the entire codebase or problem at once: large repository analysis, unfamiliar project areas, multi-file changes, refactors, or tasks that need exploration before planning or implementation.
---

# Iterative Subagent Retrieval

Use this workflow when a task is too broad for one direct worker pass.

## Core rule

Do not send a subagent into a large task with vague instructions and unlimited context. Narrow the task in stages.

## The pattern

### Phase 1: Explore

Spawn a focused explorer to gather evidence, not to solve everything.

Explorer goals:
- identify relevant files, symbols, or docs
- map the project terminology
- find likely source-of-truth locations
- return a shortlist, not a full solution

Expected output:
- 3-7 relevant files or artifacts
- why each one matters
- key uncertainties or missing context

### Phase 2: Refine

Use the exploration results to sharpen the task.

Refinement goals:
- drop irrelevant paths
- identify the exact area of change
- turn a broad request into a specific next task

If needed, run one more narrow exploration pass rather than jumping straight to implementation. For most tasks, keep this to 1-2 exploration passes, not an open-ended analysis loop.

### Phase 3: Execute

Only now hand work to an implementer/planner/reviewer with the refined context.

Good execution prompts include:
- the shortlist of files
- the concrete subproblem
- explicit constraints
- what not to spend time on

### Phase 4: Review

Use a separate pass to check correctness, missing edge cases, or factual claims.

## When to use

Use this skill when:
- a repository is unfamiliar
- the user asks for broad analysis
- the task spans multiple subsystems
- context size is becoming a problem
- you need better subagent reliability

## When not to use

Do not use this pattern for tiny, obvious tasks where a direct pass is cheaper. Use it when narrowing context will materially improve quality, not by default for every task.

## OpenClaw guidance

Prefer role clarity:
- **Explorer** for evidence gathering
- **Planner/Worker** for the refined task
- **Reviewer** for critique and risk detection

Do not over-spawn. A small number of staged passes beats many vague ones.

## Anti-patterns

Avoid:
- sending the whole problem to one worker immediately
- copying huge context dumps into every subagent
- letting exploration turn into premature implementation
- spawning many agents before the task is narrowed
