# US-001 — Initiate and Review a Payroll Run

**As an** HR admin,
**I want to** generate a payroll run for the current pay period,
**So that** I can review computed gross pay, deductions, and net pay before approving disbursement.

## Acceptance Criteria

- [ ] "Run Payroll" button initiates a `POST /payroll/run` request
- [ ] Run summary card shows: pay period, employee count, total gross, total deductions, total net
- [ ] Per-employee roster table shows each employee's gross, deductions, net, and status
- [ ] SSE stream updates the roster in real time as employees are processed
- [ ] Admin can add a bonus or deduction to any employee before approval
- [ ] "Approve Run" button is disabled until run status is `completed`

## Definition of Done

- [ ] Run initiation API call wired up with loading state
- [ ] SSE connection established on run start; closed on run completion
- [ ] Per-employee rows update without full-page reload
- [ ] Optimistic UI for bonus/deduction add (with rollback on error)

## Notes

- The backend owns all calculation; the frontend only displays results
- SSE reconnect logic must handle dropped connections gracefully
