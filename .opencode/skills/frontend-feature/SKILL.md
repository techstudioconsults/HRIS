---
name: frontend-feature
description: Frontend-only feature development loop workflow (Planner → Frontend → Reviewer → Optimizer)
---

We are working on a frontend-only feature.

## Phases

Planner → Frontend Implementer → Reviewer → Optimizer

## Workflow

Load `/home/kingsley/blackbox/.ai/fullstack/workflows/frontend-feature.md` for the detailed phase instructions.

## Context sources (global blackbox — read-only)

- Architecture: `/home/kingsley/blackbox/.ai/fullstack/context/architecture.md`
- Frontend architecture: `/home/kingsley/blackbox/.ai/fullstack/context/frontend-architecture.md`
- Tech stack: `/home/kingsley/blackbox/.ai/fullstack/context/tech-stack.md`
- API contracts: `/home/kingsley/blackbox/.ai/fullstack/context/api-contracts.md`
- Constraints: `/home/kingsley/blackbox/.ai/fullstack/context/constraints.md`
- Readiness checklist: `/home/kingsley/blackbox/.ai/fullstack/context/readiness-checklist.md`
- Coding standards: `/home/kingsley/blackbox/.ai/fullstack/context/coding-standards.md`

## Project memory & state (shared — read/write)

Memory: `.ai/memory/` | State: `.ai/state/`

## Instructions

1. Initialize `.ai/state/current-feature.md` with the feature name, goal, and acceptance criteria.
2. Set `.ai/state/loop-status.md` to Phase 1 — Plan.
3. Switch to the Planner role (`@planner`) and begin.
4. After each phase completes, update `.ai/state/current-feature.md` and hand off to the next agent.
