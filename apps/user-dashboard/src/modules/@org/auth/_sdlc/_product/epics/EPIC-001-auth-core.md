---
section: product
topic: epic
id: EPIC-001
---

# EPIC-001 — Auth Core

## Goal

Provide a secure, multi-mode authentication system that allows company owners and employees to access the HRIS platform.

## User Stories

| ID     | Story                   | Status   |
| ------ | ----------------------- | -------- |
| US-001 | Password login          | ✅ Built |
| US-002 | OTP login               | ✅ Built |
| US-003 | Company registration    | ✅ Built |
| US-004 | Forgot + reset password | ✅ Built |
| US-005 | Session auto-refresh    | ✅ Built |
| US-006 | Route protection        | ✅ Built |

## Acceptance Criteria (Epic Level)

- [ ] All auth forms validate client-side before submission.
- [ ] All auth errors show clear, actionable messages.
- [ ] No credentials appear in browser console, localStorage, or URLs.
- [ ] Auth pages are inaccessible to already-authenticated users.
- [ ] Session silently refreshes when the access token expires.
- [ ] Sign-out clears the session and redirects to /login cleanly.
