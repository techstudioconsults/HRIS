---
name: update-state
description: Checkpoint the current session into shared state files
---

Checkpoint the current session into the shared state files.

## State files (shared — read/write)

- `.ai/state/current-feature.md`
- `.ai/state/last-output.md`
- `.ai/state/loop-status.md`

## Memory files (shared — append only)

- `.ai/memory/known-issues.md`
- `.ai/memory/decisions.md`

## Instructions

1. Read the three state files above.
2. Update `current-feature.md`: mark completed sub-tasks, add new ones, update blockers.
3. Update `last-output.md`: ISO timestamp, 2-5 bullet summary, files changed, key decisions, next step.
4. Update `loop-status.md`: current workflow, phase, agent, pending handoff, blockers.
5. If gotchas were discovered: append them to `.ai/memory/known-issues.md`.
6. If architectural decisions were made: append them to `.ai/memory/decisions.md`.
7. Print a 3-line summary: feature+phase | last done | next step.

Do not modify source code.
