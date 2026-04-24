# Admin Employee Module — Authentication Guards

_How authentication is enforced at every layer of the employee module._

## Layer 1 — Middleware (proxy.ts)

`proxy.ts` runs on every request before the page renders. For `/admin/employee` and all sub-routes:

1. `getToken()` reads the NextAuth JWT cookie.
2. If `token === null` → unauthenticated → redirect to `/login`.
3. If `token.permissions` does not include `ADMIN` or `HR_MANAGER` → redirect to the user's dashboard (`getDashboardRoute(token.permissions)`).
4. If token is valid and permissions are present → allow through.

No component in this module renders for unauthenticated or unauthorised users.

## Layer 2 — HTTP Interceptor (httpConfig.ts)

The Axios response interceptor handles `401 Unauthorized` from the backend:

1. On first `401` (not already retried): attempt `tokenManager.refreshAccessToken()`.
2. If refresh succeeds: retry the original request with the new access token.
3. If refresh fails: `tokenManager.invalidate()` + `signOut({ redirect: false })` + `redirectToLogin()`.
4. The `_retried` flag on the request config prevents infinite retry loops.

## Layer 3 — Backend API

The backend independently validates the JWT on every request. The frontend auth guards are defence-in-depth only — the backend does not trust the client's routing decisions.

## Session Expiry Behaviour

When an employee session expires mid-session while on an employee management page:

1. The next API call returns `401`.
2. The interceptor attempts token refresh.
3. If refresh fails, `signOut({ redirect: false })` clears the NextAuth cookie.
4. `redirectToLogin()` sends the user to `/login`.
5. `proxy.ts` allows the `/login` route because the cookie is now cleared (avoids redirect loop).
