---
section: architecture
topic: adr
id: ADR-001
status: Accepted
---

# ADR-001 — Auth Architecture: NextAuth + Dual Login Modes

## Context

The platform needs authentication for both company owners (who register) and employees (who are invited). Two login modes are required: password and OTP. The session must carry permissions for the RBAC system.

## Decision

1. **Use NextAuth for session management** — JWT cookie strategy with a 24-hour session lifetime and 60-minute update interval. NextAuth manages the cookie lifecycle, CSRF protection, and session refresh scheduling.

2. **Password login via NextAuth Credentials provider** — The UI calls `signIn('credentials', { email, password })`. NextAuth's provider calls `/auth/login/password` and maps the response to the session JWT. This keeps credentials handling server-side and out of client state.

3. **OTP login via AuthService directly** — OTP flow is a two-step mutation (requestOTP → loginWithOTP). The second step returns the same `{ employee, tokens, permissions }` payload as password login. The client calls `signIn('credentials')` with the OTP token to establish the session, or manages session manually. (Implementation detail: confirm with backend whether a session cookie is set server-side on OTP verify.)

4. **Access token + refresh token pair stored in session** — the access token is injected into every API request by the HttpAdapter interceptor. On 401, the interceptor calls the refresh endpoint, updates the session, and retries.

5. **AuthService for non-login mutations** — register, forgotPassword, resetPassword, requestOTP, loginWithOTP all go through AuthService → HttpAdapter. Never called via raw fetch.

## Consequences

- **Positive**: Single source of truth for session state (NextAuth); credentials never touch client state.
- **Positive**: OTP path reuses the same session infrastructure as password path.
- **Negative**: Two auth paths (NextAuth credentials + AuthService OTP) must be kept in sync if the session format changes.
- **Risk**: OTP login session creation must be verified end-to-end — the exact mechanism for establishing a NextAuth session post-OTP needs confirmation.
