# Environments

_Environment-specific configuration and secrets documentation._

## Environments

| Environment  | Purpose           | Branch      | URL                        |
| ------------ | ----------------- | ----------- | -------------------------- |
| `dev`        | Local development | `feature/*` | `http://localhost:3000`    |
| `staging`    | Pre-production QA | `develop`   | `https://staging.hris.app` |
| `production` | Live              | `main`      | `https://hris.app`         |

## What Goes Here

- `.env.example` for each environment (no real values — placeholders only)
- Environment variable documentation (name, type, required, description)
- Secrets rotation runbook references

## Required Variables

See each app's `.env.example`. Common variables: `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`, `BACKEND_URL`, `DATABASE_URL`, `REDIS_URL`.
