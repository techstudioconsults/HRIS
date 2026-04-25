# Auth — Auth Guards

## Layer 1: proxy.ts Middleware (Edge)

Runs on every navigation. For auth pages:

```
Request to /login, /register, /forgot-password, /reset-password, /onboarding/*
  └─▶ proxy.ts
        ├── getToken() → null              → allow through (serve the auth page)
        └── getToken() → isAuthenticated: true
              └─▶ getDashboardRoute(permissions)  → redirect to dashboard
```

This prevents the session flicker of rendering the login page briefly before redirecting.

## Layer 2: NextAuth Session (Server + Client)

- Session cookie is HTTP-only, SameSite=Lax, Secure in production.
- Session lifetime: 24 hours (`maxAge: 24 * 60 * 60`).
- Session is re-validated every 60 minutes (`updateAge: 60 * 60`).
- If the session is invalid or expired, `getToken()` returns `null` → proxy treats as unauthenticated.

## Layer 3: HttpAdapter Token Refresh (Runtime)

Once a session is established, API calls use the access token:

```
API call with expired access token
  └─▶ Backend returns 401
        └─▶ HttpAdapter interceptor
              └─▶ tokenManager.refreshAccessToken()
                    ├── Success → update session, retry original request
                    └── Failure → signOut({ redirect: false }) → redirectToLogin()
```

## What Protects the Auth Endpoints Themselves?

`/auth/login/password`, `/auth/login/otp`, etc. are **backend-enforced** — rate limiting, CSRF via NextAuth, brute force protection. The frontend does not implement additional guards beyond proper form validation.

## CSRF Protection

NextAuth handles CSRF token generation for the `signIn()` call. Do not bypass NextAuth's `signIn()` for password login — direct POST to `/auth/login/password` from the client skips CSRF protection.
