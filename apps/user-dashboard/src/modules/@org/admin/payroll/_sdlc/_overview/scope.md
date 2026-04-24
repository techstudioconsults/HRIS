# Payroll Management — Scope

_Defines what is in and out of scope for the admin payroll management module._

## In Scope

- Payroll setup: configure pay cycle (weekly, bi-weekly, monthly), pay day, and organisation bank details. First-run wizard for new organisations.
- Payroll run management: generate a payroll run for a pay period, review the computed pay summary, approve and execute the run.
- Bonus and deduction management: add one-off or recurring bonuses (performance, allowance) and deductions (loans, salary advances, tax adjustments) to individual employees before a run is approved.
- Employee roster in payroll: add employees to or remove employees from a payroll run; view per-employee payslip details within a run.
- Wallet management: view wallet balance, fund the wallet via bank transfer initiation, view transaction history.
- Payroll scheduling: schedule a future payroll run for a specific date and time via a drawer.
- Real-time run status: SSE-based notifications showing progress of an active payroll run (e.g. "Processing 45/200 employees").
- Payslip viewer: view a generated payslip for any employee and any completed run, including gross pay, deductions breakdown, and net pay.

## Out of Scope

- Employee self-service payslip access (handled in `employee` module).
- Tax authority filing and remittance (handled by finance/compliance integration — future roadmap).
- Multi-currency payroll (single organisation currency only in V1).
- Payroll reversal and period amendments (future roadmap; requires backend support).
- Time and attendance integration (will feed into payroll calculation — planned as a separate integration layer).

## Boundaries

This module is a frontend admin feature consuming the HRIS backend REST API and an SSE endpoint. It does not own payroll calculation logic — the backend owns all computation. The frontend is responsible for presenting the results, enabling admin decisions (approve/reject run, add bonus/deduction), and initiating wallet funding. Complex multi-step state is managed with Zustand.
