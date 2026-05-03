---
description: Start a frontend-only feature loop (Planner → Frontend → Reviewer → Optimizer)
agent: planner
subtask: true
---

We are starting a frontend-only feature.

**Feature:** $ARGUMENTS

Phases: Planner → Frontend Implementer → Reviewer → Optimizer

Load the detailed workflow skill by calling `skill({ name: "frontend-feature" })`.

Context: `/home/kingsley/blackbox/.ai/fullstack/context/` (global blackbox — read-only)
Memory: `.ai/memory/` | State: `.ai/state/`

Initialize `.ai/state/current-feature.md`. Track phases in `.ai/state/loop-status.md`.
Start with the Planner role now.
