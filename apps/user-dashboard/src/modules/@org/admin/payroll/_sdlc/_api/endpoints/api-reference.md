# Admin Payroll — API Reference

## Base URL: `/api/v1/payroll`

---

### Setup

`GET /payroll/setup` — get current setup config
`POST /payroll/setup` — save setup (first-time wizard)

---

### Payroll Runs

`GET /payroll/run?current=true` — get the active/latest run
`GET /payroll/run/:id` — get a specific run
`POST /payroll/run` — initiate a new run: `{ periodStart, periodEnd }`
`POST /payroll/run/:id/approve` — approve a completed run

`GET /payroll/run/:id/stream` — SSE endpoint; emits `PayrollProgressEvent` JSON lines

---

### Roster

`GET /payroll/run/:id/roster?page=&size=` — paginated roster entries
`GET /payroll/run/:id/payslip/:employeeId` — per-employee payslip

---

### Adjustments

`POST /payroll/run/:id/adjustments` — add bonus/deduction: `{ employeeId, type, label, amount }`
`DELETE /payroll/run/:id/adjustments/:adjustmentId` — remove an adjustment

---

### Wallet

`GET /payroll/wallet` — current balance
`GET /payroll/wallet/transactions?page=&size=` — transaction history
`POST /payroll/wallet/fund` — initiate funding: `{ amount }` — returns bank transfer details

---

### Key Error Codes

| Status | Code                   | Meaning                                  |
| ------ | ---------------------- | ---------------------------------------- |
| `409`  | `RUN_ALREADY_EXISTS`   | Run already exists for this period       |
| `402`  | `INSUFFICIENT_BALANCE` | Wallet balance < total net pay           |
| `409`  | `RUN_NOT_APPROVABLE`   | Run status is not `completed`            |
| `422`  | `EXCEEDS_GROSS`        | Deduction amount exceeds employee gross  |
| `403`  | `RUN_LOCKED`           | Run is approved — adjustments disallowed |
