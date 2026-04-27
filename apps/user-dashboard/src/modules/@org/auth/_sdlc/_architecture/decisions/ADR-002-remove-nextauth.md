---
section: architecture
topic: adr
id: ADR-002
status: Accepted
supersedes: ADR-001
date: 2026-04-26
---

# ADR-002 — Remove NextAuth: Custom JWT Cookie Session

## Context

ADR-001 adopted NextAuth v5 (Credentials provider, JWT strategy) as the session layer.
After 6 weeks of integration, three pain points emerged:

1. **Leaky abstraction** — NextAuth is woven into every layer:
   `signIn` in views → `getToken` in middleware → `getSession` in TokenManager →
   `signOut` in the 401 interceptor. The backend already issues JWTs; NextAuth adds
   complexity without adding security.

2. **Broken OTP flow** — `InputOtpCard` calls `signIn('otp', ...)` but no `otp`
   provider is configured in `auth.ts`. OTP login has never worked end-to-end.

3. **`useSession()` scattered across 17 components** — session shape is not typed
   from a single source of truth; `AuthState.user` is typed as `any`.

## Decision

Remove NextAuth entirely. Replace it with a custom session layer:

### Cookie strategy

| Cookie        | Contents                                            | Flags                                                        |
| ------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `__hris_at`   | Backend JWT access token                            | HTTP-only · Secure (prod) · SameSite=Strict                  |
| `__hris_rt`   | Backend JWT refresh token                           | HTTP-only · Secure (prod) · SameSite=Strict · Path=/api/auth |
| `__hris_meta` | HMAC-SHA256 signed `{ id, role, permissions, exp }` | HTTP-only · Secure (prod) · SameSite=Strict                  |

### BFF Route Handlers (Next.js)

| Route               | Method | Purpose                                                    |
| ------------------- | ------ | ---------------------------------------------------------- |
| `/api/auth/session` | POST   | Set all 3 cookies after login                              |
| `/api/auth/token`   | GET    | Return `{ accessToken, expiresAt }` to client TokenManager |
| `/api/auth/session` | DELETE | Clear all cookies (logout)                                 |
| `/api/auth/refresh` | POST   | Read `__hris_rt` cookie → call backend → rotate cookies    |

### Drop-in compatibility layer

`src/lib/session/` exposes `useSession()`, `SessionProvider`, and `getSession()`
with the **same API shape** as `next-auth/react`. All 17 consumer files change only
their import path — no logic changes required.

### Proxy middleware

`proxy.ts` replaces `getToken()` from `next-auth/jwt` with direct cookie access:
reads `__hris_meta`, verifies HMAC-SHA256 signature using the Web Crypto API
(Edge-compatible, no new dependencies), extracts `{ role, permissions }`.

### Token Manager

`TokenManager` replaces `getSession()` from `next-auth/react` with a fetch to
`GET /api/auth/token`. The Route Handler reads the HTTP-only cookie server-side
and returns `{ accessToken, expiresAt }`. The client caches it in memory only —
tokens never touch `localStorage` or non-HTTP-only storage.

## Options Considered

| Option                                     | Rejected because                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Keep NextAuth, fix OTP                     | OTP cannot be fixed without a custom provider that duplicates our own session logic |
| Iron-session                               | Extra dependency; we already have Web Crypto in the runtime                         |
| jose directly                              | Extra dependency for the signing step; Web Crypto covers HMAC-SHA256 natively       |
| Keep NextAuth for password, custom for OTP | Split session logic is worse than one unified approach                              |

## Consequences

**Positive:**

- Single, owned session layer — no black-box framework in the critical auth path.
- OTP and password login use the same session establishment code path.
- `useSession` typed from a single source of truth; `AuthState.user` is `User | null`.
- Proxy reads a lightweight signed cookie instead of a full JWT decode chain.
- Removing `next-auth` reduces the dependency surface by ~12 transitive packages.

**Negative:**

- We own the session cookie security model — CSRF, SameSite, Secure flags must be
  correct. **Mitigation:** SameSite=Strict prevents cross-site request forgery for
  same-origin apps; HTTPS enforced in production via `Secure` flag.
- `AUTH_SECRET` is required for HMAC signing — must be set in all environments.
  **Mitigation:** App startup validation will throw if `AUTH_SECRET` is missing.

## Migration Checklist

- [ ] Write `src/lib/session/` (types, cookie-names, session-manager, context, hooks)
- [ ] Write `/api/auth/session` and `/api/auth/refresh` Route Handlers
- [ ] Rewrite `src/lib/http/token-manager.ts`
- [ ] Rewrite `src/lib/http/httpConfig.ts`
- [ ] Rewrite `src/proxy.ts`
- [ ] Add `loginWithPassword()` to `AuthService`
- [ ] Rewrite `_views/login/index.tsx` — remove `signIn('credentials', ...)`
- [ ] Fix `_views/input-otp-card/index.tsx` — remove `signIn('otp', ...)`
- [ ] Update 17 `useSession` consumers (import path only)
- [ ] Update 2 `signOut` consumers to use `useLogout` hook
- [ ] Delete `src/lib/next-auth/auth.ts`
- [ ] Delete `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Remove `next-auth` from `package.json`
- [ ] Update `constraints.md` — replace NextAuth constraint with custom session constraint
