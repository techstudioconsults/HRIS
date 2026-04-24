# Admin Payroll — Non-Functional Requirements

## Performance

| Requirement                         | Target                           |
| ----------------------------------- | -------------------------------- |
| Payroll page initial load           | < 3 seconds (P95)                |
| SSE progress first event            | < 2 seconds after run initiation |
| SSE reconnect on drop               | < 3 seconds                      |
| Roster table render (200 employees) | < 2 seconds after data load      |
| Payslip modal open (cache hit)      | < 100ms                          |
| Wallet balance load                 | < 1 second                       |

## Reliability

- SSE must auto-reconnect on connection drop with exponential backoff (max 3 attempts, then show error).
- Payroll run state in Zustand must be reset on page navigation to prevent stale data.
- Approval endpoint is idempotent — accidental double-submit must not double-debit the wallet.

## Security

- Only `ADMIN` role can access `/admin/payroll` — enforced in `proxy.ts`.
- Wallet funding initiation requires the admin to re-enter their password (2FA challenge — backend-enforced).
- Payslip data must not be cached in browser storage — session memory only.

## Observability

- All run initiation, approval, and adjustment events logged with actor ID and timestamp on backend.
- SSE connection errors logged with `runId` context for monitoring.

## Compliance

- Payroll runs are immutable once `approved` — no edits permitted after approval.
- Payslips must be permanently accessible for audit (archived on backend; not deleted after X days).
- All financial amounts stored and displayed in NGN (Naira) with two decimal places.
