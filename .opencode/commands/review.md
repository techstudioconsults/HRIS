---
description: Invoke the Reviewer agent for a structured code review
agent: reviewer
subtask: true
---

Act as the Reviewer agent.

Load the detailed workflow skill by calling `skill({ name: "review" })`.

Context: `/home/kingsley/blackbox/.ai/fullstack/context/constraints.md`, `/home/kingsley/blackbox/.ai/fullstack/context/readiness-checklist.md`, `/home/kingsley/blackbox/.ai/fullstack/context/api-contracts.md`, `/home/kingsley/blackbox/.ai/fullstack/context/coding-standards.md`
Memory: `.ai/memory/patterns.md`, `.ai/memory/decisions.md`, `.ai/memory/known-issues.md`
State: `.ai/state/current-feature.md`

Use git diff and git log to understand what changed.
Categorize findings: Blocking | Major | Minor | Positive.
End with: Approved / Approved with changes / Needs rework.
