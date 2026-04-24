# Admin Payroll — System Design Overview

## Module Boundaries

The payroll module owns the `/admin/payroll` route and all sub-routes. It reads employee and settings data from their respective modules' APIs. It does not own payroll calculation — the backend owns all computation. The frontend is responsible for run management, bonus/deduction entry, wallet operations, and payslip display.

## Technology Choices

| Concern                  | Choice                     | Rationale                                                                                |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------------------------- |
| Server state             | TanStack Query             | Run list, roster, wallet balance — standard cache management                             |
| Real-time run progress   | Native `EventSource` (SSE) | Unidirectional server push; simpler than WebSocket for progress events                   |
| SSE state bridge         | Zustand slice              | SSE events update a `payrollRunStore` outside React's render cycle; components subscribe |
| Complex multi-step state | Zustand                    | Setup wizard, run approval flow — too complex for TanStack Query alone                   |
| Form management          | React Hook Form + Zod      | Setup wizard, bonus/deduction forms                                                      |
| Table                    | TanStack Table             | Employee roster with sort, filter, and per-row actions                                   |

## Module File Structure

```
admin/payroll/
├── _components/
│   ├── PayrollSetupWizard.tsx      — 3-step first-run wizard
│   ├── PayrollRunCard.tsx          — active/latest run summary
│   ├── PayrollRosterTable.tsx      — per-employee run details
│   ├── BonusDeductionDrawer.tsx    — add bonus/deduction
│   ├── PayslipViewer.tsx           — per-employee payslip modal
│   ├── WalletPanel.tsx             — balance + fund wallet
│   └── PayrollScheduleDrawer.tsx  — schedule a future run
├── _views/payroll.tsx
├── hooks/
│   ├── usePayrollRun.ts
│   ├── usePayrollRoster.ts
│   ├── usePayrollSSE.ts            — manages EventSource lifecycle
│   └── useWallet.ts
├── services/payroll-service.ts
├── store/payrollRunStore.ts        — Zustand slice for SSE state
├── schemas/
└── types/
```

## SSE Architecture

`usePayrollSSE(runId)` opens an `EventSource` to `GET /payroll/run/:id/stream`. On each event:

1. Parse the JSON payload
2. Call `payrollRunStore.updateProgress(event)` — Zustand store update
3. Components subscribed to the store re-render with new progress

On run completion, the SSE connection is closed and TanStack Query is invalidated to fetch final totals.

## Key Design Decisions

1. Zustand for SSE state — SSE events arrive outside React's lifecycle; a Zustand store bridges them into component subscriptions cleanly.
2. Backend owns calculation — the frontend never computes gross pay or deductions; it only displays what the API returns.
3. Approval is a two-step confirm — a confirmation dialog prevents accidental run approval.
