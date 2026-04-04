---
name: verification-loop-openclaw
description: Lightweight verification workflow for OpenClaw. Use after non-trivial code, config, documentation, or workflow changes; before declaring work done; before committing; or when a task could have caused regressions even if the change looked small.
---

# Verification Loop for OpenClaw

Use this skill before calling work done.

## Core rule

Finishing implementation is not the same as finishing the task. Verify the result.

## Verification ladder

Run only the checks relevant to the task, but do not skip verification entirely. Keep verification proportional to the change:
- small change -> sanity check + diff review may be enough
- larger code change -> build/test/lint/typecheck as relevant
- config or workflow change -> validate the behavior that was actually affected

### 1) Confirm scope

Answer:
- What changed?
- Which files or systems were touched?
- What could have been affected indirectly?

### 2) Run the obvious checks

Depending on the task, use the relevant subset:
- build
- tests
- lint
- typecheck
- script execution
- preview/smoke test
- docs/config validation

If a check cannot be run, say so clearly. Do not hide skipped verification behind vague phrases like "should work".

### 3) Review the diff

Inspect what actually changed:
- look for accidental edits
- look for debug leftovers
- check naming, paths, and comments
- verify the change matches the requested task

### 4) Check for regressions or risk

Ask:
- Could this break an adjacent workflow?
- Did a config change weaken safety or validation?
- Does this rely on assumptions that were not tested?

### 5) Report honestly

End with a concise status:
- verified and ready
- partially verified with stated gaps
- not ready, with concrete issues

## Minimum output format

When relevant, summarize:
- checks run
- checks skipped
- result
- remaining risk or uncertainty

## Good triggers

Use this skill when:
- editing code or scripts
- changing configuration
- modifying docs that affect real workflows
- preparing a commit
- finishing a bugfix or feature

## Anti-patterns

Avoid:
- saying done without checks
- relying only on reasoning when executable checks exist
- hiding skipped checks
- ignoring the diff after automated checks pass
