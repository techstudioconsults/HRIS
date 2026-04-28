Act as the Reviewer agent. Load `/home/kingsley/blackbox/.ai/fullstack/agents/reviewer.md`.

Context loaded in session: constraints, readiness-checklist, api-contracts, coding-standards.
Memory: `.claude/memory/patterns.md`, `.claude/memory/decisions.md`, `.claude/memory/known-issues.md`
State: `.claude/state/current-feature.md`

Use git diff and git log to understand what changed.
Categorize: Blocking | Major | Minor | Positive.
End with: Approved / Approved with changes / Needs rework.
