# User Payslip — Auth Guards

## Route-Level Guard

The `/user/payslip` route is protected by `proxy.ts` (Next.js middleware). Any request without a valid NextAuth session is redirected to `/login` before the page renders.

```
Request → proxy.ts
  ├── getToken() → null          → redirect /login
  ├── getToken() → isAuthenticated: false → redirect /login
  └── getToken() → isAuthenticated: true  → allow through
```

No special permission flag is required beyond `isAuthenticated`. The payslip section is available to all authenticated roles.

## API-Level Guard (Backend)

Every API call from this module carries `Authorization: Bearer <accessToken>`. The backend:

1. Validates the JWT signature and expiry.
2. Extracts `employeeId` from the `sub` claim.
3. Filters all queries to that `employeeId` — the client never specifies it.

## Token Refresh Guard

The `HttpAdapter` interceptor handles expired tokens transparently:

1. On 401: attempt `tokenManager.refreshAccessToken()`.
2. If refresh succeeds: retry the original request once (`_retried` flag prevents loops).
3. If refresh fails: `tokenManager.invalidate()` + `signOut({ redirect: false })` + `redirectToLogin()`.

This module does not implement any custom 401 handling — it relies entirely on the global interceptor.

## Session Expiry UX

When the session expires mid-session (e.g., user leaves the tab open overnight), the next API call triggers the interceptor. If refresh fails, the user is silently signed out and redirected to `/login`. No data from the payslip module is persisted to survive the redirect.
