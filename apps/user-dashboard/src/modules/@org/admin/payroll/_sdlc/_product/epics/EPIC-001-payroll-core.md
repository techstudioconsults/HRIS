# EPIC-001 — Payroll Core: Run, Review, and Disburse

## Goal

Deliver a complete payroll run lifecycle for HR admins — from first-time setup through calculation, review, approval, and disbursement — with real-time progress visibility via SSE.

## Business Value

Replaces manual, spreadsheet-based payroll with an auditable, rules-driven system. Eliminates calculation errors, accelerates pay cycle closure, and provides a single source of truth for payslips.

## Stories

- US-001: Payroll setup wizard
- US-002: Initiate a payroll run and review computed totals
- US-003: Approve and execute a run; monitor SSE progress
- US-004: Add bonus or deduction to an employee within a run
- US-005: View per-employee payslip
- US-006: View wallet balance and initiate funding

## Acceptance Criteria (High Level)

- [ ] First-time setup wizard collects pay cycle, pay day, and bank details in 3 steps
- [ ] HR admin can generate a payroll run for the current period
- [ ] Run summary shows total gross pay, total deductions, total net pay, and employee count
- [ ] Admin can approve the run; once approved, run transitions to `paid` on wallet debit
- [ ] SSE stream shows live progress during a long-running calculation
- [ ] Bonuses and deductions can be added/removed before approval
- [ ] Payslip viewer shows full breakdown per employee per run
- [ ] All run events logged with actor identity and timestamp

## Dependencies

- Settings module: pay cycle and deduction rules
- Employee module: employee list with salary data
- Wallet service: balance check and debit
- SSE endpoint: `GET /payroll/run/:id/stream`
