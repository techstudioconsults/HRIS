---
section: product
topic: user-story
id: US-003
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-003 — Company Registration

## Story

As a company owner, I want to register my company and create an owner account so
that I can set up the HRIS platform for my organisation.

## Acceptance Criteria

- [ ] Form collects: `companyName`, `domain`, `firstName`, `lastName`, `email`, `password`, `confirmPassword`.
- [ ] All fields validated by Zod before submit (password strength: uppercase + lowercase + number + special char).
- [ ] Real-time password match indicator shown once the user starts typing in `confirmPassword`.
- [ ] On `201`: Sonner success toast + redirect to `/login`.
- [ ] On `409` (conflict): field-level email error "This email or domain is already registered."
- [ ] On `422`: field-level errors mapped from backend response.
- [ ] Submit button disabled while request is in flight.
- [ ] "Already have an account?" link navigates to `/login`.
- [ ] Privacy Policy and Terms & Conditions links open in a new tab.

## Flow

```
User fills registration form
  → RHF validates (Zod)
  → AuthService.signUp(data)
    → POST /auth/onboard
    ← { success: true }
  → toast.success(...)
  → router.push('/login')
```

## Error Cases

| Status | Scenario              | UI Behaviour                                          |
| ------ | --------------------- | ----------------------------------------------------- |
| `409`  | Email/domain conflict | Inline email field error                              |
| `422`  | Validation error      | Field-level errors from backend                       |
| `400`  | Bad request           | Root form error                                       |
| `500`  | Server error          | Root error: "Something went wrong. Please try again." |
