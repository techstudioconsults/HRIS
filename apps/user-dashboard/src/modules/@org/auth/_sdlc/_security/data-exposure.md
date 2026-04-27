# Auth — Data Exposure Analysis

## Data Classification

| Data Element   | Classification      | Storage                                    | Notes                                       |
| -------------- | ------------------- | ------------------------------------------ | ------------------------------------------- |
| Password (raw) | Highly Confidential | Never stored client-side                   | Sent over TLS only; never logged            |
| Access token   | Confidential        | NextAuth HTTP-only cookie only             | Never in localStorage/JS state              |
| Refresh token  | Confidential        | NextAuth HTTP-only cookie only             | Never exposed to client JS                  |
| Email address  | Internal            | Form state (transient), NextAuth session   | Not persisted in localStorage               |
| Employee name  | Internal            | NextAuth session, useAuthStore (in-memory) | Cleared on logout                           |
| Permissions    | Internal            | NextAuth session, useAuthStore (in-memory) | Not user-editable client-side               |
| OTP            | Highly Confidential | Form state only (transient)                | Never stored; submitted once then discarded |
| Reset token    | Confidential        | URL query param only                       | Time-limited; single-use                    |

## Persistence Boundaries

- **HTTP-only cookie** — the only place tokens persist. Inaccessible to JavaScript.
- **localStorage / sessionStorage** — auth tokens and credentials are **never** written here.
- **Zustand auth store** — in-memory only; cleared on logout and tab close.
- **React Hook Form** — form values are in-memory only; not serialized to storage.

## Exposure Risks and Mitigations

| Risk                                  | Mitigation                                                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Credential logging                    | `console.log` is forbidden in production code (coding-standards.md). Credentials never appear in structured logs. |
| Token exposure in URLs                | Tokens are in cookies, never in query strings. Reset token is in the URL but is one-time-use.                     |
| Password visibility in forms          | Password fields are `type="password"` by default; toggle adds `type="text"` — never logs the value.               |
| Email enumeration via forgot-password | Backend always returns 200; UI always shows CheckMailCard regardless.                                             |
| XSS stealing session cookie           | HTTP-only cookie prevents JS access. NextAuth sets SameSite=Lax.                                                  |
| CSRF on login                         | NextAuth's `signIn()` includes a CSRF token automatically.                                                        |
| Session fixation                      | NextAuth rotates the session cookie on each sign-in.                                                              |
