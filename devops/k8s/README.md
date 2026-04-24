# Kubernetes

_Kubernetes manifests and Helm charts for production deployment._

## What Goes Here

- `base/` — Kustomize base manifests (Deployments, Services, ConfigMaps, Ingress)
- `overlays/` — per-environment patches (`dev/`, `staging/`, `prod/`)
- `charts/` — Helm charts if applicable
- `hpa.yaml` — Horizontal Pod Autoscaler configs per service

## Deployment Strategy

Rolling updates with `maxUnavailable: 0` and `maxSurge: 1`.
All secrets via Kubernetes Secrets or external secrets operator — never in manifests.

## Health Checks

All services must define `livenessProbe` and `readinessProbe` before going to production.
