---
description: Start a new fullstack feature loop (Planner → Architect → Backend → Frontend → Reviewer → Optimizer)
agent: planner
subtask: true
---

We are starting a new fullstack feature.

**Feature:** $ARGUMENTS

Phases: Planner → Architect → Backend Implementer → Frontend Implementer → Reviewer → Optimizer

Load the detailed workflow skill by calling `skill({ name: "fullstack-feature" })`.

Context: `/home/kingsley/blackbox/.ai/fullstack/context/` (global blackbox — read-only)
Memory: `.ai/memory/` | State: `.ai/state/`

Initialize `.ai/state/current-feature.md`. Track phases in `.ai/state/loop-status.md`.
Start with the Planner role now.
