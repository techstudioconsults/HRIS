---
description: Start a bugfix workflow (Reproduce → Diagnose → Fix → Review → Document)
---

We are fixing a bug.

**Bug:** $ARGUMENTS

Phases: Reproduce → Diagnose → Fix → Review → Document

Load the detailed workflow skill by calling `skill({ name: "bugfix" })`.

Memory: `.ai/memory/` | State: `.ai/state/`

Check `.ai/memory/known-issues.md` first. Update `.ai/state/current-feature.md` with repro steps.
Start by reproducing the bug now.
