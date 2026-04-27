---
section: product
topic: epic
id: EPIC-001
version: 2.0
updated: 2026-04-26
---

# EPIC-001 — Auth Core (v2 — Custom Session)

## Goal

Provide a secure, multi-mode authentication system that allows company owners and
employees to access the HRIS platform — built without NextAuth, using a custom
HTTP-only cookie session layer owned entirely by this codebase.

## User Stories

| ID     | Story                                               | Status                                    |
| ------ | --------------------------------------------------- | ----------------------------------------- |
| US-001 | Password login — email + password → session cookies | 🔄 Rebuild                                |
| US-002 | OTP login — email → 6-digit code → session cookies  | 🔄 Rebuild                                |
| US-003 | Company registration — company + owner details      | ✅ Exists (no session change needed)      |
| US-004 | Forgot password — email → reset link                | ✅ Exists (no session change needed)      |
| US-005 | Reset password — token + new password               | ✅ Exists (no session change needed)      |
| US-006 | Logout — clear cookies + redirect                   | 🔄 Rebuild (replaces NextAuth signOut)    |
| US-007 | Auto token refresh on 401                           | 🔄 Rebuild (remove getSession dependency) |
| US-008 | Route protection via proxy.ts                       | 🔄 Rebuild (remove getToken dependency)   |

## Acceptance Criteria (Epic Level)

- [ ] All auth forms validate client-side (Zod) before any network call.
- [ ] All auth errors surface clear, actionable user-facing messages.
- [ ] No credentials, tokens, or session data in `localStorage`, `sessionStorage`, or non-HTTP-only cookies.
- [ ] Auth pages (`/login`, `/register`, etc.) are inaccessible to authenticated users.
- [ ] Access token rotates silently on 401 — no user interruption during active sessions.
- [ ] Logout clears all cookies server-side — no residual session data.
- [ ] Route protection enforced at the Edge without any backend round-trips.
- [ ] `useSession()` consumers require only an import path change — no logic rewrites.
- [ ] Zero `next-auth` imports remaining after migration.
- [ ] TypeScript strict mode — no `any` in auth module types.

## Sprint Reference

Sprint 1 — Onboarding, Authentication and Authorization (17/05/2025 – 31/05/2025)
ADR-002 accepted 2026-04-26 — supersedes ADR-001 (NextAuth).
