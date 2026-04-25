---
section: architecture
topic: system-design-overview
---

# Auth — System Design Overview

## Key Design Decisions

### 1. NextAuth Credentials Provider for Password Login

Password login does NOT call the backend directly from the client. The flow is:

```
Client → NextAuth signIn('credentials') → Next.js API route → /auth/login/password (backend)
       ← JWT session cookie ←──────────────────────────────────────────────────────────────
```

This keeps credentials server-side and produces a secure HTTP-only session cookie.

### 2. AuthService for All Other Mutations

Registration, OTP request/verify, forgot/reset password all call `AuthService` via `HttpAdapter`. These are React Query mutations (no server caching — all mutationFn).

### 3. Zustand Auth Store for UI State Only

`useAuthStore` holds `{ user, isAuthenticated, sessionExpiry }` for in-memory UI state. It is **not** the source of truth — NextAuth session is. The store is populated from the session on mount and cleared on sign-out. It is not persisted.

### 4. No TanStack Query Cache for Auth Data

Auth flows are mutations, not queries. No query keys needed. The `useAuthService` hooks expose `useMutation` wrappers only.

### 5. Route Protection via proxy.ts Middleware

`proxy.ts` runs at the edge on every request:

- Authenticated users on auth pages (`/login`, `/register`, etc.) → redirect to dashboard
- Unauthenticated users on protected pages → redirect to `/login`
- This is the single gate — no additional client-side guards needed on the auth pages themselves.

### 6. Component Architecture

```
/login page
  └── LoginView
        ├── LoginForm            (email + password, React Hook Form + Zod)
        └── OtpLoginToggle       → navigates to /login/otp

/login/otp page
  └── OtpLoginView
        └── OtpLoginForm         (email only → submit → requestOTP)

/login/otp-verify page
  └── OtpVerifyView
        └── InputOtpCard         (6-digit input → submit → loginWithOTP)

/register page
  └── RegisterView
        └── RegisterForm         (company + personal details, React Hook Form + Zod)

/forgot-password page
  └── ForgotPasswordView
        └── ForgotPasswordForm   (email only → forgotPassword mutation)

/reset-password page
  └── ResetPasswordView
        └── ResetPasswordForm    (new password + confirm → resetPassword mutation)
```
