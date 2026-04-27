---
section: product
topic: user-story
id: US-004
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-004 — Forgot Password

## Story

As a user who has forgotten their password, I want to receive a reset link by email
so that I can regain access to my account.

## Acceptance Criteria

- [ ] Form collects `email` — validated as a valid email address.
- [ ] On success: inline "Check your mail" confirmation card shown (not a page navigation).
- [ ] On success: Sonner info toast "Reset link sent. Check your inbox."
- [ ] Response is always treated as success (backend prevents email enumeration — always returns 200).
- [ ] "Back to Login" link on the confirmation card navigates to `/login`.
- [ ] Submit button disabled while request is in flight.

## Flow

```
User enters email
  → AuthService.forgotPassword({ email })
    → POST /auth/forgotpassword
    ← { success: true, data: "Password link sent successfully" }
  → show CheckMailCard component
```

## Error Cases

| Status | Scenario             | UI Behaviour                                          |
| ------ | -------------------- | ----------------------------------------------------- |
| `422`  | Invalid email format | Field-level validation error                          |
| `500`  | Server error         | Root error: "Something went wrong. Please try again." |

> `404` is intentionally not surfaced — backend always returns 200 to prevent enumeration.
