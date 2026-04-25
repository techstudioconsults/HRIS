---
section: architecture
topic: sequence-diagram-error-flow
---

# Auth — Error Flows (Sequence Diagrams)

## Invalid Credentials (401)

```
Browser        LoginForm      NextAuth         Backend API
   |               |              |                 |
   |-- submit ────▶|              |                 |
   |               |-- signIn() ─▶|                 |
   |               |              |-- POST /auth/login/password ──▶|
   |               |              |◀── 401 { title: "Invalid credentials" }
   |               |◀── { ok: false, error: "Invalid credentials" }
   |               |-- form.setError('root', { message })
   |◀── inline form error displayed
```

## Account Locked / Too Many Attempts (429)

```
Browser        LoginForm      NextAuth         Backend API
   |               |              |                 |
   |-- submit ────▶|              |                 |
   |               |-- signIn() ─▶|                 |
   |               |              |-- POST /auth/login/password ──▶|
   |               |              |◀── 429 { title: "Too many attempts" }
   |               |◀── { ok: false, error: "Too many attempts. Try again in 15 minutes." }
   |◀── inline form error displayed
```

## OTP Expired

```
Browser        InputOtpCard   AuthService      Backend API
   |               |               |               |
   |-- submit OTP ▶|               |               |
   |               |-- loginWithOTP() ─────────────▶|
   |               |               |◀── 400 { title: "OTP expired" }
   |               |◀── error ─────|               |
   |               |-- show "Your code has expired. Request a new one."
   |               |-- highlight ResendOtpButton
```

## Token Refresh Failure (Session Expired Mid-Session)

```
Browser        HttpAdapter    tokenManager     NextAuth
   |               |               |               |
   |-- any API ───▶|               |               |
   |               |◀── 401 ───────────────────────|
   |               |-- refreshAccessToken() ───────▶|
   |               |               |◀── 401 ────────|
   |               |-- invalidate() ───────────────▶|
   |               |-- signOut({ redirect: false })─▶|
   |               |-- redirectToLogin()             |
   |◀── /login (clean redirect, no loop)            |
```

## Registration — Email Already Exists (409)

```
Browser        RegisterForm   AuthService      Backend API
   |               |               |               |
   |-- submit ────▶|               |               |
   |               |-- signUp() ──▶|               |
   |               |               |-- POST /auth/onboard ──────────▶|
   |               |               |◀── 409 { title: "Email already registered" }
   |               |◀── error ─────|               |
   |               |-- form.setError('email', { message })
   |◀── inline email field error shown
```
