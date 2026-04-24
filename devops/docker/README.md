# Docker

_Container build definitions for all HRIS services._

## What Goes Here

- `Dockerfile` for each app (`apps/user-dashboard`, `apps/web`)
- `docker-compose.yml` for local full-stack development (app + PostgreSQL + Redis)
- `docker-compose.ci.yml` for CI test environment
- `.dockerignore` files

## Build Strategy

Multi-stage builds: `deps` → `builder` → `runner`. Production images use `node:20-alpine`.
Dev-only packages must never leak into the `runner` stage.

## Local Development

```bash
docker compose up        # start all services
docker compose up db     # start only PostgreSQL + Redis
```
