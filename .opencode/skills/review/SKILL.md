---
name: review
description: Code review against project readiness checklist
---

## Role specification

Act as the Reviewer agent. Load: `/home/kingsley/blackbox/.ai/fullstack/agents/reviewer.md`

## Context sources (global blackbox — read-only)

- Constraints: `/home/kingsley/blackbox/.ai/fullstack/context/constraints.md`
- Readiness checklist: `/home/kingsley/blackbox/.ai/fullstack/context/readiness-checklist.md`
- API contracts: `/home/kingsley/blackbox/.ai/fullstack/context/api-contracts.md`
- Coding standards: `/home/kingsley/blackbox/.ai/fullstack/context/coding-standards.md`

## Project memory & state (shared — read/write)

- Patterns: `.ai/memory/patterns.md`
- Decisions: `.ai/memory/decisions.md`
- Known issues: `.ai/memory/known-issues.md`
- Current feature: `.ai/state/current-feature.md`

## Instructions

1. Use git diff and git log to understand what changed.
2. Run through every item in `/home/kingsley/blackbox/.ai/fullstack/context/readiness-checklist.md`.
3. Categorize findings: **Blocking** | **Major** | **Minor** | **Positive**.
4. End with one of: Approved / Approved with changes / Needs rework.
5. Update `.ai/state/loop-status.md` with the review outcome.
