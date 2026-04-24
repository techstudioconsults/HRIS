# Admin Payroll — State Management

## Server State (TanStack Query)

| Hook                       | Key                                    | staleTime                         |
| -------------------------- | -------------------------------------- | --------------------------------- |
| `usePayrollSetup`          | `['payroll', 'setup']`                 | 30 min                            |
| `usePayrollRun(id)`        | `['payroll', 'run', id]`               | 0 (always fresh — status changes) |
| `usePayrollRoster(id)`     | `['payroll', 'roster', id]`            | 0                                 |
| `useWallet`                | `['payroll', 'wallet']`                | 1 min                             |
| `usePayslip(runId, empId)` | `['payroll', 'payslip', runId, empId]` | 10 min                            |

`staleTime: 0` for run and roster because they change during SSE-driven processing.

## Real-Time State (Zustand — `payrollRunStore`)

```typescript
interface PayrollRunState {
  runId: string | null;
  status: PayrollRunStatus;
  progress: { processed: number; total: number };
  sseConnected: boolean;
  updateProgress: (event: PayrollSSEEvent) => void;
  setRunId: (id: string) => void;
  reset: () => void;
}
```

SSE events are handled outside React's render cycle and written into this store. `PayrollRunCard` and `PayrollRosterTable` subscribe via `usePayrollRunStore()`.

## Form State (React Hook Form)

- `PayrollSetupWizard` — multi-step; each step has its own `useForm`; a top-level wizard controller aggregates values at submit.
- `BonusDeductionDrawer` — single-form instance, reset on drawer close.
- `FundWalletDrawer` — amount input with Zod validation.

## UI State (Local useState)

| State                    | Location             | Description                              |
| ------------------------ | -------------------- | ---------------------------------------- |
| Wizard current step      | `PayrollSetupWizard` | 0–2 step index                           |
| Selected roster employee | `PayrollRosterTable` | For payslip viewer and adjustment drawer |
| Approve dialog open      | `PayrollRunCard`     | Controls ApproveRunDialog visibility     |
| Fund wallet drawer open  | `WalletPanel`        | Controls FundWalletDrawer visibility     |

## Anti-patterns to Avoid

- Do not poll the run status — use SSE for live updates; TanStack Query for the final completed state.
- Do not store payslip data in Zustand — TanStack Query manages it with proper caching.
- Do not merge SSE state and server state — keep them separate; reconcile only on SSE completion.
