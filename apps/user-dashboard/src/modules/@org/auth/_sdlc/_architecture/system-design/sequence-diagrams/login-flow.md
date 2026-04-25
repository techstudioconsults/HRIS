---
section: architecture
topic: sequence-diagram-login-flow
---

# Auth — Login Flow (Sequence Diagrams)

## Password Login — Happy Path

```
Browser        LoginForm      NextAuth         Backend API      proxy.ts
   |               |              |                 |               |
   |-- submit ────▶|              |                 |               |
   |               |-- signIn() ─▶|                 |               |
   |               |              |-- POST /auth/login/password ───▶|
   |               |              |                 |-- validate creds
   |               |              |◀── { employee, tokens, permissions }
   |               |              |-- encode JWT cookie             |
   |◀── Set-Cookie: next-auth.session-token ──────────────────────|
   |               |◀── { ok: true }              |               |
   |               |-- router.push('/dashboard') ─────────────────▶|
   |               |              |                 |               |-- getToken() → valid
   |◀── /dashboard ────────────────────────────────────────────────|
```

## OTP Login — Happy Path

```
Browser        OtpLoginForm   AuthService      Backend API
   |               |               |               |
   |-- submit ────▶|               |               |
   |               |-- requestOTP()▶|               |
   |               |               |-- POST /auth/login/requestotp ──▶|
   |               |               |◀── { success: true }             |
   |               |◀── success ───|               |
   |               |-- navigate to /login/otp-verify               |
   |               |               |               |
   |-- enter OTP ─▶|               |               |
   |               |-- loginWithOTP()──────────────▶|
   |               |               |-- POST /auth/login/otp ──────────▶|
   |               |               |◀── { employee, tokens, permissions }
   |               |◀── session ───|               |
   |               |-- router.push('/dashboard')    |
```
