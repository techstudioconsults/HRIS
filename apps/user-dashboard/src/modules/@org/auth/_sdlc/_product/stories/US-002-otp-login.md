---
section: product
topic: user-story
id: US-002
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-002 — OTP Login

## Story

As an employee, I want to log in using a one-time code sent to my email so that I
can access the platform without needing to remember a password.

## Acceptance Criteria

- [ ] Step 1 — Email form: validates email format before submit.
- [ ] Step 1 — On submit: calls `POST /auth/login/requestotp` and navigates to `/login/otp-verify?email=<encoded>`.
- [ ] Step 2 — OTP input: 6-digit input component; each digit is individually focusable and auto-advances.
- [ ] Step 2 — Submit enabled only when all 6 digits are entered.
- [ ] Step 2 — On success: `POST /api/auth/session` sets cookies → redirect to `/login/continue`.
- [ ] Step 2 — On `400` (invalid/expired OTP): inline error "Invalid or expired code. Request a new one."; OTP input cleared.
- [ ] Step 2 — "Resend code" button re-calls `requestOTP`; shows loading state while pending.
- [ ] Step 2 — "Wrong email?" link navigates back to `/login/otp`.
- [ ] Zero NextAuth imports in the flow (`signIn('otp', ...)` removed).

## Flow

```
Step 1: /login/otp
  User enters email
  → AuthService.requestOTP({ email })
    → POST /auth/login/requestotp
  → router.push('/login/otp-verify?email=<encoded>')

Step 2: /login/otp-verify
  User enters 6-digit code
  → AuthService.loginWithOTP({ email, password: otpCode })
    → POST /auth/login/otp
    ← { employee, tokens, permissions }
  → POST /api/auth/session (BFF)
  → router.push('/login/continue')
```

## Error Cases

| Status | Scenario               | UI Behaviour                                          |
| ------ | ---------------------- | ----------------------------------------------------- |
| `400`  | OTP invalid or expired | Inline error; OTP input cleared                       |
| `429`  | Too many OTP attempts  | Root error: "Too many attempts. Request a new code."  |
| `422`  | Email validation       | Field-level error                                     |
| `500`  | Server error           | Root error: "Something went wrong. Please try again." |
