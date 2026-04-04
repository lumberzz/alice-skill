---
name: search-first-openclaw
description: Research-before-action workflow for OpenClaw. Use when starting a new coding task, analyzing a repository, considering a new script or helper, changing infrastructure/config, or whenever it is tempting to implement before checking what already exists locally or in official docs.
---

# Search First for OpenClaw

Use this workflow before adding new code, new process, or confident technical conclusions.

## Core rule

Prefer this order:
1. Search source-of-truth files in the workspace
2. Read the local docs, tests, and configs that govern the task
3. Check official external docs if the question depends on outside behavior
4. Only then decide whether to reuse, adapt, or build

## Workflow

### 1) Search locally first

Start with the current workspace:
- look for source-of-truth files first: implementation, tests, configs, scripts
- look for existing docs and established patterns
- find relevant symbols, commands, or configs
- check whether the same problem is already solved nearby

Questions to answer:
- Does this already exist?
- Is there a project convention for it?
- Is there a local doc or note I should follow?

### 2) Read governing files

Prefer the files that actually control behavior:
- implementation files
- tests and examples that show intended behavior
- config files
- task-specific scripts
- project and workspace docs

Do not jump from search results straight to implementation if the governing file has not been read.

### 3) Check official docs when needed

Use external documentation only when the answer depends on behavior outside the workspace, for example:
- framework/library APIs
- CLI behavior
- platform/provider constraints
- version-specific semantics

Prefer official docs over random blog posts.

### 4) Decide explicitly

After searching, choose one of:
- **Reuse**: the solution already exists; use it
- **Adapt**: a close pattern exists; extend it carefully
- **Build**: nothing suitable exists; implement something new

State the decision internally before making changes.

## Good triggers

Use this skill when:
- analyzing a GitHub repo
- adding a feature that likely already has patterns in the codebase
- writing a helper or script
- changing config or infra behavior
- deciding whether to add a dependency
- reviewing an unfamiliar project area

## Anti-patterns

Avoid:
- implementing before searching
- trusting memory over current files
- citing external behavior without checking docs
- inventing a new pattern when the repo already has one

## Output discipline

When reporting back, summarize:
- what already existed
- what governing files/docs were checked
- whether the decision is reuse, adapt, or build
