---
section: testing
topic: test-plan
---

# Admin Payroll — Test Plan

## Unit Tests

| Target                      | Cases                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `PayrollSetupSchema`        | valid input passes; missing payCycle fails; payDay 0 fails; payDay 32 fails                                    |
| `AdjustmentSchema`          | valid bonus passes; valid deduction passes; zero amount fails; negative amount fails; missing label fails      |
| `FundWalletSchema`          | valid amount passes; zero amount fails; negative amount fails                                                  |
| `payrollRunStore` (Zustand) | initial state; `setProgress` updates; `setCompleted` transitions to completed; `setError` transitions to error |
| `formatNaira` util          | 1000 → "₦1,000.00"; 0 → "₦0.00"; large integer → correct grouping                                              |

## Integration Tests (MSW + RTL)

| Flow                               | Scenarios                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| Payroll setup load                 | Fetches setup on mount; displays pay cycle and pay day                        |
| Payroll setup save                 | POST on submit; success toast; stale setup query invalidated                  |
| Run initiation                     | POST /run; SSE stream simulated; progress bar advances; completed state shown |
| Approve run — success              | POST /run/:id/approve; success toast; run card shows "Approved"               |
| Approve run — insufficient balance | 402 response; InsufficientBalanceDialog renders with shortfall                |
| Add adjustment — success           | POST /run/:id/adjustments; drawer closes; roster refetched                    |
| Add adjustment — EXCEEDS_GROSS     | 422 response; `amount` field shows inline error                               |
| Delete adjustment                  | DELETE /run/:id/adjustments/:adjId; 204; optimistic row removed               |
| Fund wallet — get instructions     | POST /wallet/fund; modal shows bank name, account, amount, expiry             |
| Wallet transaction history         | GET /wallet/transactions; renders transaction rows                            |

## E2E Tests (Playwright)

| Path                 | Scenario                                                              |
| -------------------- | --------------------------------------------------------------------- |
| `/admin/payroll`     | Page loads; wallet balance and run card visible                       |
| Setup wizard         | Complete 3-step wizard; redirects to payroll overview                 |
| Full run lifecycle   | Initiate → SSE progress → Review roster → Approve                     |
| Add bonus            | Open adjustment drawer; add bonus; verify roster updated              |
| Insufficient balance | Approve with low wallet; dialog shown; fund wallet link navigates     |
| Fund wallet          | Complete fund flow; bank details displayed with copy button           |
| Payslip download     | Click employee row; payslip modal opens; print button present         |
| Keyboard navigation  | Tab through run card actions; focus order correct                     |
| ADMIN guard          | Logged-in non-admin visiting `/admin/payroll` redirected to dashboard |

## Accessibility Checks

- All run status badges pass WCAG 1.4.1 (text + colour).
- Progress bar has `role="progressbar"` with `aria-valuenow` / `aria-valuemax`.
- Modals trap focus and restore on close.
- All form inputs have associated `<label>`.
- Financial figures in tables use `font-mono` but maintain readable contrast.
