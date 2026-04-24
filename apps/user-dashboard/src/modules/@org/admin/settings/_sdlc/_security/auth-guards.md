# Settings Module — Authentication Guards

## Layer 1 — Middleware (proxy.ts)

For all `/admin/settings*` routes:

1. `getToken()` reads the NextAuth JWT.
2. `token === null` → redirect to `/login`.
3. `token.permissions` does not include `ADMIN` → redirect to `getDashboardRoute(token.permissions)` (not `/login` — avoids redirect loop).
4. Token valid + `ADMIN` permission present → allow through.

## Layer 2 — HTTP Interceptor

Same as all admin modules: `401` from the settings API triggers token refresh; on refresh failure, `signOut({ redirect: false })` + `redirectToLogin()`.

## Layer 3 — Backend API

The backend enforces `admin:settings:write` permission scope on all mutation endpoints. The frontend RBAC is defence-in-depth only.

## Organisation Scoping

`organisationId` is never accepted from the request body. It is always read from the authenticated JWT on the backend. A settings mutation cannot affect another organisation's data regardless of client-side payload.
