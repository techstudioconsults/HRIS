# Admin Payroll — Fetch Flow

## Payroll Page Load

```
Admin Browser    PayrollView    TanStack Query    Backend API
     |                |               |                |
     |-- /admin/payroll               |                |
     |                |-- usePayrollSetup()            |
     |                |-------------------------> GET /payroll/setup
     |                |               |<-- { setupComplete: true, ... }
     |                |-- usePayrollRun()              |
     |                |-------------------------> GET /payroll/run?current=true
     |                |               |<-- { data: PayrollRun }
     |                |-- useWallet() |                |
     |                |-------------------------> GET /payroll/wallet
     |                |               |<-- { data: WalletBalance }
     |<-- full payroll view rendered
```

## Payroll Roster Table Load

```
Admin Browser    PayrollRosterTable    TanStack Query    Backend API
     |                   |                   |                |
     |-- run selected --->|                  |                |
     |                   |-- usePayrollRoster(runId)         |
     |                   |-------------------------> GET /payroll/run/:id/roster
     |<-- skeleton rows  |               |<-- PaginatedRoster
     |<-- roster rows rendered
```

## Payslip View

```
Admin clicks "View Payslip"
  → usePayslip(runId, employeeId)
    → [cache miss] GET /payroll/run/:id/payslip/:employeeId
      → PayslipViewer modal populated
```
