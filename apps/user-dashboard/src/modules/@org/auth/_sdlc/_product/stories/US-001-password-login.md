---
section: product
topic: user-story
id: US-001
epic: EPIC-001
version: 2.0
updated: 2026-04-26
---

# US-001 — Password Login

## Story

As an employee or owner, I want to sign in with my email and password so I can
access the HRIS platform securely.

## Acceptance Criteria

- [ ] Form requires email (valid format) and password (non-empty) — validated by Zod before submit.
- [ ] On success: `POST /api/auth/session` is called with the backend response, cookies are set, user is redirected to `/login/continue`.
- [ ] On `401`: inline form error "Invalid email or password." — email field is not cleared.
- [ ] On `429`: root error "Too many attempts. Please try again later."
- [ ] On `500`: root error "Something went wrong. Please try again."
- [ ] Submit button is disabled while the request is in flight.
- [ ] "Forgot password?" link is visible and navigates to `/forgot-password`.
- [ ] "Log in with OTP instead" button navigates to `/login/otp`.
- [ ] Authenticated users navigating directly to `/login` are redirected to their dashboard.
- [ ] Zero NextAuth imports in the entire flow.

## Flow

```
User fills email + password
  → RHF validates (Zod)
  → AuthService.loginWithPassword({ email, password })
    → POST /auth/login/password (backend)
    ← { employee, tokens, permissions }
  → POST /api/auth/session (BFF)
    → sets __hris_at, __hris_rt, __hris_meta cookies
  → router.push('/login/continue')
```

## Error Cases

| Status  | Scenario            | UI Behaviour                                                       |
| ------- | ------------------- | ------------------------------------------------------------------ |
| `401`   | Invalid credentials | Inline root error: "Invalid email or password."                    |
| `422`   | Validation error    | Field-level errors mapped from backend response                    |
| `429`   | Rate limited        | Root error: "Too many attempts. Please try again later."           |
| `500`   | Server error        | Root error: "Something went wrong. Please try again."              |
| Network | Timeout             | Root error: "Connection timed out. Check your internet and retry." |
