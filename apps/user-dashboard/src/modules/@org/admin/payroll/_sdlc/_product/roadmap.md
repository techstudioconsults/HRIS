# Admin Payroll — Roadmap

## Phase 1 — Core Payroll (Current)

| Story  | Description                                             | Status |
| ------ | ------------------------------------------------------- | ------ |
| US-001 | Payroll setup wizard (pay cycle, pay day, bank details) | TODO   |
| US-002 | Initiate and review a payroll run                       | TODO   |
| US-003 | Approve and execute a payroll run                       | TODO   |
| US-004 | Real-time run progress via SSE                          | TODO   |
| US-005 | Add/remove bonus and deductions per employee            | TODO   |
| US-006 | View per-employee payslip within a run                  | TODO   |
| US-007 | Wallet balance view and funding initiation              | TODO   |

## Phase 2 — Scheduling & History

- Pay schedule: schedule future runs via a drawer with date/time picker.
- Payroll history: paginated list of all past runs with status and totals.
- Run diff: compare current run against the previous one to flag anomalies.
- Bulk bonus/deduction import via CSV.

## Phase 3 — Compliance & Integrations

- PAYE, Pension, NHF statutory report generation (PDF/CSV export).
- Time-and-attendance integration feed into gross pay calculation.
- Multi-entity support: separate pay runs per legal entity within one organisation.

## Deferred

- Payroll reversal (requires backend period-amendment support).
- Multi-currency.
