---
name: backend-loop
description: Start a backend-only feature development loop
tags: [feature, backend, planning]
---

We are starting a backend-only feature loop.

**Feature:** <describe the feature in your task prompt>

## Phases

Planner → Architect → Backend Implementer → Reviewer → Optimizer

## Workflow

Load `/home/kingsley/blackbox/.ai/fullstack/workflows/backend-feature.md` for the detailed phase instructions.

## Context sources (global blackbox — read-only)

- Architecture: `/home/kingsley/blackbox/.ai/fullstack/context/architecture.md`
- Backend architecture: `/home/kingsley/blackbox/.ai/fullstack/context/backend-architecture.md`
- Tech stack: `/home/kingsley/blackbox/.ai/fullstack/context/tech-stack.md`
- Domain models: `/home/kingsley/blackbox/.ai/fullstack/context/domain-models.md`
- API contracts: `/home/kingsley/blackbox/.ai/fullstack/context/api-contracts.md`
- Constraints: `/home/kingsley/blackbox/.ai/fullstack/context/constraints.md`
- Readiness checklist: `/home/kingsley/blackbox/.ai/fullstack/context/readiness-checklist.md`
- Coding standards: `/home/kingsley/blackbox/.ai/fullstack/context/coding-standards.md`

## Project memory & state (shared — read/write)

Memory: `.ai/memory/` | State: `.ai/state/`

## Instructions

1. Read Step 0 from `.junie/AGENTS.md` before starting.
2. Initialize `.ai/state/current-feature.md` with the feature name, goal, and acceptance criteria.
3. Set `.ai/state/loop-status.md` to Phase 1 — Plan.
4. Start with the Planner role now.
