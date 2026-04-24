---
section: security
topic: data-exposure
---

# Admin Payroll — Data Exposure Controls

## PII and Financial Data in Scope

| Field                    | Classification | Exposure Rule                              |
| ------------------------ | -------------- | ------------------------------------------ |
| Employee name            | PII            | Visible in roster; omit from logs          |
| Employee number          | Internal ID    | Safe to log                                |
| Gross pay                | Financial      | Never log; mask in error messages          |
| Net pay                  | Financial      | Never log; mask in error messages          |
| Deduction amounts        | Financial      | Never log                                  |
| Bank account number      | Sensitive PII  | Never rendered in UI (admin-facing only)   |
| BVN / NIN                | Sensitive PII  | Never stored or rendered in payroll module |
| Wallet balance           | Financial      | Render in UI; never log                    |
| JWT sub / organisationId | Auth           | Safe to log at debug level only            |

## Frontend Controls

- Payroll figures are rendered as formatted Naira strings (`₦1,234,567.00`) — raw integers are never displayed.
- Payslip PDF download links are pre-signed URLs with short TTL (5 min) — never expose the raw S3 key.
- Roster table is paginated (20 per page) — never bulk-renders the full employee list.
- The `FundWallet` bank details response (account number, account name) is shown once in a modal, never persisted to local state or cache.

## Network Controls

- All payroll API calls are HTTPS only — enforced by `httpConfig.ts` base URL.
- No payroll data is written to `localStorage` or `sessionStorage`.
- TanStack Query cache holds in-memory roster + payslip data; it is cleared on `signOut`.
- SSE stream payloads contain only run status and progress percentage — no employee PII or financial totals.

## Log Hygiene

- React Query `onError` callbacks log only the error `status` and `code` — never the response body.
- The Zustand `payrollRunStore` is never serialised (no `persist` middleware) — no financial data leaks to storage.

## organisationId Scoping

All payroll API calls include the `organisationId` claim from the JWT on the backend. The frontend does not pass `organisationId` as a query parameter — the backend derives it from the token. This prevents horizontal privilege escalation between organisations.
