# Admin Payroll — Bounded Context

## Context Map

```
┌──────────────────────────────────────────────────────────┐
│               Payroll Context (this)                      │
│                                                           │
│  Owns: PayrollRun, PayrollRoster, Adjustment,             │
│        Payslip, Wallet, WalletTransaction, PaySchedule    │
└──────────────────────┬────────────────────────────────────┘
                       │ reads from
         ┌─────────────▼────────────┐   ┌────────────────────────┐
         │   Employee Context       │   │   Settings Context     │
         │                          │   │                        │
         │  Provides: EmployeeList  │   │  Provides: PayCycle    │
         │  (with salary data)      │   │  DeductionRules        │
         └──────────────────────────┘   └────────────────────────┘

         ┌────────────────────────────────────┐
         │   User Payslip Context (read-only) │
         │   (employee self-service)          │
         │  Reads: Payslip by employeeId      │
         └────────────────────────────────────┘
```

## What This Context Owns

| Aggregate           | Responsibility                                              |
| ------------------- | ----------------------------------------------------------- |
| `PayrollRun`        | Lifecycle: draft → processing → completed → approved → paid |
| `PayrollRoster`     | Per-employee pay detail within a run                        |
| `Adjustment`        | Bonus or deduction applied to an employee before approval   |
| `Payslip`           | Immutable per-employee pay document for a completed run     |
| `Wallet`            | Organisation funding account — balance and transactions     |
| `WalletTransaction` | Ledger entry for each wallet credit/debit                   |
| `PaySchedule`       | Pre-configured future run trigger                           |

## Invariants

1. A `PayrollRun` transitions only forward: draft → processing → completed → approved → paid. No reversals.
2. `Adjustments` can only be added/removed when run status is `completed` (not yet approved).
3. A run cannot be approved if `wallet.balance < run.totalNetPay`.
4. `Payslips` are immutable once a run is `approved` — no edits permitted.
5. `organisationId` is always derived from the JWT — never from the client payload.
