---
section: product
topic: user-story
id: US-001
---

# US-001 — Password Login

## Story

As an employee or owner, I want to sign in with my email and password so I can access the HRIS platform.

## Acceptance Criteria

- [ ] Form requires email (valid format) and password (non-empty).
- [ ] Submitting valid credentials sets the NextAuth session and redirects to the dashboard.
- [ ] Invalid credentials show an inline error without clearing the email field.
- [ ] Submit button is disabled while the login request is in flight.
- [ ] After 3 failed attempts, the error message hints at account lockout (backend-driven).
- [ ] "Forgot password?" link is visible and navigates to /forgot-password.
- [ ] "Sign in with OTP" link is visible and navigates to /login/otp.
- [ ] Authenticated users who navigate directly to /login are redirected to the dashboard.

## Error Cases

| Error                   | UI Behaviour                                              |
| ----------------------- | --------------------------------------------------------- |
| 401 Invalid credentials | Inline form root error: "Invalid email or password."      |
| 422 Validation          | Field-level errors from backend Zod schema                |
| 429 Rate limited        | Root error: "Too many attempts. Try again in 15 minutes." |
| 500 Server error        | Root error: "Something went wrong. Please try again."     |
