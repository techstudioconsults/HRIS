---
description: Resume work from the last saved checkpoint
---

Resume from last checkpoint.

1. Read `.ai/state/current-feature.md`, `.ai/state/last-output.md`, `.ai/state/loop-status.md`.
2. Read the active agent role spec from `/home/kingsley/blackbox/.ai/fullstack/agents/<role>.md` (check loop-status for current role).
3. Summarize in 4 lines:
   - Feature: <name>
   - Phase: <current phase>
   - Last action: <what was done>
   - Next step: <exact next action>
4. Wait for user confirmation before proceeding.
