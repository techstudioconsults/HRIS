# Admin Payroll — Mutation Flow

## Initiate Payroll Run + SSE

```
Admin      PayrollView    PayrollService    Backend API    SSE Stream    Zustand Store
  |              |               |               |              |              |
  |-- Run Payroll|               |               |              |              |
  |              |-- POST /payroll/run            |              |              |
  |<-- loading   |               |<-- 201 { id, status:'processing' }         |
  |              |-- setRunId(id) in Zustand                     |              |
  |              |-- usePayrollSSE(id).open() --> EventSource    |              |
  |              |               |               |  SSE event: { processed:1, total:200 }
  |              |               |               |              |              |
  |              |               |               |    updateProgress() ------> |
  |<-- progress bar updates (45/200)              |              |              |
  |              |               |               |  SSE event: 'completed'    |
  |              |               |               |              |-- close()    |
  |              |-- invalidate ['payroll','run', id] → refetch final totals  |
  |<-- run summary with totals; Approve button enabled
```

## Approve Run

```
Admin    ApproveRunDialog    PayrollService    Backend API    TanStack Query
  |             |                  |               |               |
  |-- Confirm   |                  |               |               |
  |             |-- POST /payroll/run/:id/approve  |               |
  |<-- loading  |                  |<-- 200 { status: 'approved' } |
  |             |                  |-- invalidate ['payroll','run',id]
  |             |                  |-- invalidate ['payroll','wallet']
  |<-- run status badge shows 'paid' after wallet debit completes
```

## Add Adjustment (Bonus/Deduction)

```
Admin    BonusDeductionDrawer    PayrollService    Backend API    TanStack Query
  |              |                    |               |               |
  |-- Submit     |                    |               |               |
  |              |-- POST /payroll/run/:id/adjustments               |
  |<-- loading   |                    |<-- 201 { data: Adjustment }  |
  |              |                    |-- invalidate ['payroll','roster', runId]
  |<-- drawer closes; roster row updates with new net pay
```
