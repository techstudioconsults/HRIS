---
section: architecture
topic: sequence-diagram-mutation-flow
---

# Auth — Mutation Flow (Sequence Diagrams)

## Forgot Password

```
Browser        ForgotPasswordForm   AuthService   Backend API
   |               |                    |              |
   |-- submit ────▶|                    |              |
   |               |-- forgotPassword()─▶|              |
   |               |                    |-- POST /auth/forgotpassword ──▶|
   |               |                    |◀── { success: true }           |
   |               |◀── success ────────|              |
   |               |-- render CheckMailCard             |
   |◀── "Check your inbox" UI shown
```

## Reset Password

```
Browser        ResetPasswordForm   AuthService   Backend API
   |               |                   |              |
   |-- submit ────▶|                   |              |
   |               |-- resetPassword() ▶|              |
   |               |  (token from URL)  |-- POST /auth/resetpassword ──▶|
   |               |                   |◀── { success: true }           |
   |               |◀── success ───────|              |
   |               |-- toast "Password reset successfully."
   |               |-- router.push('/login')           |
   |◀── /login
```

## Registration

```
Browser        RegisterForm    AuthService    Backend API
   |               |               |              |
   |-- submit ────▶|               |              |
   |               |-- signUp() ──▶|              |
   |               |               |-- POST /auth/onboard ──────────▶|
   |               |               |◀── 201 { success: true }         |
   |               |◀── success ───|              |
   |               |-- toast "Account created. Please log in."
   |               |-- router.push('/login')       |
   |◀── /login
```
