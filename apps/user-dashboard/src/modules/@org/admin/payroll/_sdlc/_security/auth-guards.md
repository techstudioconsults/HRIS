# Admin Payroll — Authentication Guards

## Layer 1 — Middleware (proxy.ts)

For `/admin/payroll*`: `getToken()` must return a token with `ADMIN` permission. Non-admin authenticated users are redirected to their dashboard (not `/login`).

## Layer 2 — HTTP Interceptor

`401` from any payroll API triggers token refresh. On refresh failure: `signOut({ redirect: false })` + `redirectToLogin()`.

## Layer 3 — Backend API

The backend enforces `admin:payroll:write` scope on all mutation endpoints. The backend also enforces `organisationId` scoping from the JWT — no cross-organisation data access is possible.

## Wallet Funding — Extra Guard

Wallet funding initiation (`POST /payroll/wallet/fund`) requires a re-authentication challenge on the backend (password confirmation or 2FA code). This is a backend-enforced guard for high-value financial operations.

## SSE Authentication

The SSE endpoint (`GET /payroll/run/:id/stream`) requires the same JWT as all other payroll endpoints. The `EventSource` request includes the `Authorization` header via a custom wrapper (native `EventSource` does not support custom headers; we use `fetch` with `ReadableStream` or a polyfill library).
