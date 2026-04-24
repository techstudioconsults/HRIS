# Admin Payroll — Data Flow

## Read: Payroll Page Load

```
PayrollView mounts
  ├── usePayrollSetup() → GET /payroll/setup
  │     → setupComplete? → render wizard or run view
  ├── usePayrollRun() → GET /payroll/run?current=true
  │     → PayrollRunCard + PayrollRosterTable
  └── useWallet() → GET /payroll/wallet
        → WalletPanel
```

## Write: Initiate Run

```
Admin clicks "Run Payroll"
  → POST /payroll/run { periodStart, periodEnd }
    → 201 { data: PayrollRun { id, status: 'processing' } }
      → invalidate ['payroll', 'run', 'current']
        → usePayrollSSE(runId) opens EventSource
          → SSE events → payrollRunStore.updateProgress()
            → components re-render with live progress
          → SSE 'completed' event
            → EventSource.close()
            → invalidate ['payroll', 'run', runId] → fetch final totals
```

## Write: Approve Run

```
Admin confirms ApproveRunDialog
  → POST /payroll/run/:id/approve
    → 200 { data: { status: 'approved' } }
      → backend debits wallet
      → run transitions to 'paid' (async via webhook or SSE)
        → invalidate ['payroll', 'run', runId]
        → invalidate ['payroll', 'wallet']
```

## Write: Add Bonus/Deduction

```
BonusDeductionDrawer.submit
  → POST /payroll/run/:id/adjustments { employeeId, type, amount, label }
    → 201 { data: Adjustment }
      → invalidate ['payroll', 'roster', runId] → roster table refreshes
```

## Cache Keys

| Hook               | Query Key                                   |
| ------------------ | ------------------------------------------- |
| `usePayrollSetup`  | `['payroll', 'setup']`                      |
| `usePayrollRun`    | `['payroll', 'run', runId]`                 |
| `usePayrollRoster` | `['payroll', 'roster', runId]`              |
| `useWallet`        | `['payroll', 'wallet']`                     |
| `usePayslip`       | `['payroll', 'payslip', runId, employeeId]` |
