---
section: product
topic: user-story
id: US-005
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-005 — Reset Password

## Story

As a user with a valid reset link, I want to set a new password so that I can
regain access to my account.

## Acceptance Criteria

- [ ] Reset token is read from URL query param `?token=<value>` — not shown to the user.
- [ ] Form collects `password` and `confirmPassword` — validated by Zod (strength rules + match).
- [ ] Real-time password match indicator shown once `confirmPassword` has input.
- [ ] On `200`: Sonner success toast + redirect to `/login`.
- [ ] On `400` (expired/used token): error message "This reset link has expired. Request a new one." with link to `/forgot-password`.
- [ ] On `422` (passwords don't match): field-level `confirmPassword` error.
- [ ] Submit button disabled if token is missing from URL or while request is in flight.

## Flow

```
User arrives at /reset-password?token=<token>
  → token extracted from URL (useSearchParams)
  → User fills password + confirmPassword
  → RHF validates (Zod)
  → AuthService.resetPassword({ password, confirmPassword, token })
    → POST /auth/resetpassword
    ← { success: true }
  → toast.success(...)
  → router.push('/login')
```

## Error Cases

| Status        | Scenario               | UI Behaviour                                  |
| ------------- | ---------------------- | --------------------------------------------- |
| `400`         | Token expired or used  | Full-page error with link to /forgot-password |
| `422`         | Passwords don't match  | Field-level `confirmPassword` error           |
| Missing token | URL has no token param | Redirect to /forgot-password immediately      |
| `500`         | Server error           | Root error: "Something went wrong."           |
