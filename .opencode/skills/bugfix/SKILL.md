---
name: bugfix
description: Systematic bug fix workflow (Reproduce → Diagnose → Fix → Review → Document)
---

We are fixing a bug.

## Phases

Reproduce → Diagnose → Fix → Review → Document

## Workflow

Load `/home/kingsley/blackbox/.ai/fullstack/workflows/bugfix.md` for the detailed phase instructions.

## Context sources (global blackbox — read-only)

- Constraints: `/home/kingsley/blackbox/.ai/fullstack/context/constraints.md`
- Coding standards: `/home/kingsley/blackbox/.ai/fullstack/context/coding-standards.md`

## Project memory & state (shared — read/write)

Memory: `.ai/memory/` | State: `.ai/state/`

## Instructions

1. Check `.ai/memory/known-issues.md` first — this bug may already be documented.
2. Update `.ai/state/current-feature.md` with the bug description and repro steps.
3. Start by reproducing the bug now.
4. When fixed: append the root cause and resolution to `.ai/memory/known-issues.md`.
