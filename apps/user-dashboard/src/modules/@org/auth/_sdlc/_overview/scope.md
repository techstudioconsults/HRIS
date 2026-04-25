---
section: overview
topic: scope
---

# Auth — Scope

## In Scope

- **Password login** — email + password via NextAuth credentials provider.
- **OTP login** — email OTP request + OTP verification as an alternative login path.
- **Registration** — company owner account creation (company name, domain, personal details, password).
- **Forgot password** — email-based reset link request.
- **Reset password** — token-validated new password submission.
- **Session management** — JWT session via NextAuth, access token + refresh token pair, automatic silent refresh via HttpAdapter interceptor.
- **Route protection** — `proxy.ts` middleware blocks unauthenticated access to protected routes and redirects authenticated users away from auth pages.

## Out of Scope

- **Google OAuth** — endpoint exists on the backend but is not wired into the UI (future work).
- **MFA / TOTP** — not in current scope.
- **Social login providers** (GitHub, LinkedIn, etc.) — not planned.
- **Admin user management** — creating / deactivating employees belongs to `admin/employee`.
- **Change password (authenticated)** — belongs to user profile settings, not this module.
- **Employee self-registration** — employees are onboarded by the company owner; this module covers the owner's initial registration only.

## Constraints

- Password login must go through NextAuth `signIn('credentials')` — never call `/auth/login/password` directly from client components.
- OTP login calls `AuthService` directly (not through NextAuth) and manages its own session creation.
- All non-NextAuth HTTP calls must use `HttpAdapter` — never raw `fetch` or `axios`.
- Auth tokens are never stored in `localStorage` — NextAuth JWT cookie only.
