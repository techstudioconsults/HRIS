# Scripts

_Operational and CI/CD automation scripts._

## What Goes Here

- `db-migrate.sh` — run Prisma migrations in CI/CD
- `seed.sh` — seed development database with test data
- `health-check.sh` — post-deploy smoke test
- `cleanup-preview.sh` — tear down preview environments on PR close
- `generate-env.sh` — pull secrets from secrets manager and write `.env`

## Conventions

- All scripts use `set -euo pipefail`
- Scripts are idempotent — safe to run multiple times
- No hardcoded credentials — use environment variables or secrets manager references
- Add a `--dry-run` flag to any destructive script
