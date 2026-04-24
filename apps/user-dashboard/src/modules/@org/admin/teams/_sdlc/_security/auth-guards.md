---
section: security
topic: auth-guards
---

# Admin Teams — Authentication Guards

## Layer 1 — Middleware (proxy.ts)

For `/admin/teams*`: `getToken()` must return a token with `ADMIN` permission. Non-admin authenticated users are redirected to their dashboard (not `/login`) to avoid redirect loops.

## Layer 2 — HTTP Interceptor

`401` from any teams API triggers token refresh. On refresh failure: `signOut({ redirect: false })` + `redirectToLogin()`.

## Layer 3 — Backend API

The backend enforces `admin:teams:write` scope on all mutation endpoints. The backend also enforces `organisationId` scoping from the JWT — no cross-organisation team access is possible.
