# Runbooks

_Step-by-step operational procedures for common and emergency scenarios._

## What Goes Here

- `incident-response.md` — P0/P1 incident triage and escalation
- `deploy-rollback.md` — how to roll back a bad production deploy
- `db-backup-restore.md` — database backup and point-in-time restore
- `secrets-rotation.md` — rotating `AUTH_SECRET`, DB credentials, API keys
- `payroll-run-failure.md` — recovery procedure if a payroll run fails mid-execution

## Runbook Format

Each runbook must include:

1. **Trigger** — when to use this runbook
2. **Pre-conditions** — what must be true before starting
3. **Steps** — numbered, copy-pasteable commands
4. **Verification** — how to confirm the issue is resolved
5. **Escalation** — who to call if the runbook doesn't work
