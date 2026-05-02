---
name: bugfix
description: Systematic bug fix workflow
tags: [bugfix, debug, reproduce]
---

We are fixing a bug.

**Bug:** <describe the bug in your task prompt>

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

1. Read Step 0 from `.junie/AGENTS.md` before starting.
2. Check `.ai/memory/known-issues.md` first — this bug may already be documented.
3. Update `.ai/state/current-feature.md` with the bug description and repro steps.
4. Start by reproducing the bug now.
5. When fixed: append the root cause and resolution to `.ai/memory/known-issues.md`.
