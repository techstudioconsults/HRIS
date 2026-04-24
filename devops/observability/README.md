# Observability

_Logging, metrics, tracing, and alerting configuration._

## What Goes Here

- `prometheus/` — scrape configs and alerting rules
- `grafana/` — dashboard JSON exports
- `opentelemetry/` — OTel collector config for distributed tracing
- `alerts/` — PagerDuty / Slack alert routing rules
- `loki/` — log aggregation pipeline config

## Key Signals to Monitor

| Signal  | Tool                 | What to watch                                          |
| ------- | -------------------- | ------------------------------------------------------ |
| Metrics | Prometheus + Grafana | API latency p95, error rate, DB pool saturation        |
| Logs    | Pino → Loki          | Structured JSON — never `console.log` in production    |
| Traces  | OpenTelemetry        | Auth flows, payroll run, leave approval critical paths |
| Uptime  | Blackbox exporter    | `/api/health` endpoint on all services                 |
