---
description: Handle a generic one-off task outside a workflow loop
---

Handling a generic one-off task.

**Task:** $ARGUMENTS

Step 0: Ask — "Should I track this on ClickUp + GitHub before we start? yes/no"

If yes: Classify (frontend/backend/both + label), create ClickUp task, create GitHub issue.
If no: proceed directly.

Execution:

1. State intent (2-3 sentences).
2. Execute with project standards (TypeScript strict, no console.log, security-first).
3. Verify the task is done.
4. Append brief entry to `.ai/state/last-output.md`.

Context: `.ai/memory/decisions.md`, `.ai/memory/known-issues.md`, constraints (loaded in session).
