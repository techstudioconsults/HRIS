# User Leave — Authentication Guards

## Layer 1 — Middleware (proxy.ts)

For `/user/leave*`:

1. `getToken()` reads the NextAuth JWT.
2. `token === null` → redirect to `/login`.
3. Token present with any valid permission → allow through.
4. The user leave route does not require a specific admin permission — all authenticated employees may access it.

## Layer 2 — HTTP Interceptor

Same as all modules: `401` triggers token refresh; on failure, `signOut({ redirect: false })` + `redirectToLogin()`.

## Layer 3 — Backend API

The backend enforces employee-scoped access via the JWT `sub` claim on every request. `GET /leave-request`, `POST /leave-request`, `PATCH /leave-request/:id`, and `DELETE /leave-request/:id` all operate on the authenticated employee's data only. The frontend cannot pass a different `employeeId` to access another employee's requests.

## Session Expiry Behaviour

If the employee's session expires while they are filling in the leave request form:

1. Form submission triggers a `401` response.
2. The interceptor attempts token refresh.
3. On failure: `signOut({ redirect: false })` clears the cookie, then `redirectToLogin()`.
4. The form input is lost — this is acceptable for a session expiry scenario (< 60 min session timeout).
