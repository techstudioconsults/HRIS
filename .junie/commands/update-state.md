Checkpoint the current session into state files.

1. Read: `.claude/state/current-feature.md`, `.claude/state/last-output.md`, `.claude/state/loop-status.md`
2. Update `current-feature.md`: mark completed sub-tasks, add new ones, update blockers.
3. Update `last-output.md`: ISO timestamp, 2-5 bullet summary, files changed, key decisions, next step.
4. Update `loop-status.md`: current workflow, phase, agent, pending handoff, blockers.
5. If gotchas found: append to `.claude/memory/known-issues.md`.
6. Print 3-line summary: feature+phase | last done | next step.

Do not modify source code.
