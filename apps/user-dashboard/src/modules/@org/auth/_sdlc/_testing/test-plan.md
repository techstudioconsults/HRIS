---
section: testing
topic: test-plan
version: 2.0
updated: 2026-04-26
---

# Auth — Test Plan (v2 — Custom Session)

## Scope

| Layer         | Tool                   | Coverage Target                                             |
| ------------- | ---------------------- | ----------------------------------------------------------- |
| Unit          | Vitest                 | Zod schemas, SessionManager sign/verify, TokenManager logic |
| Integration   | Vitest + RTL + MSW     | Form submission flows, BFF Route Handler handlers           |
| E2E           | Playwright             | Golden path for each auth flow across 2 browser targets     |
| Accessibility | `@axe-core/playwright` | WCAG 2.1 AA on all auth pages                               |

---

## Unit Tests

| ID   | Module                          | Scenario                                   |
| ---- | ------------------------------- | ------------------------------------------ |
| U-01 | `loginSchema`                   | Accepts valid email + password             |
| U-02 | `loginSchema`                   | Rejects empty password                     |
| U-03 | `loginSchema`                   | Rejects invalid email format               |
| U-04 | `registerSchema`                | Accepts all valid fields                   |
| U-05 | `registerSchema`                | Rejects mismatched passwords               |
| U-06 | `registerSchema`                | Rejects invalid email format               |
| U-07 | `registerSchema`                | Rejects password without special character |
| U-08 | `resetPasswordSchema`           | Rejects mismatched passwords               |
| U-09 | `forgotPasswordSchema`          | Rejects non-email string                   |
| U-10 | `SessionManager.sign()`         | Returns a non-empty HMAC-signed string     |
| U-11 | `SessionManager.verify()`       | Returns payload for valid signature        |
| U-12 | `SessionManager.verify()`       | Returns null for tampered payload          |
| U-13 | `SessionManager.verify()`       | Returns null for expired `exp`             |
| U-14 | `TokenManager.getAccessToken()` | Returns cached token when valid            |
| U-15 | `TokenManager.getAccessToken()` | Fetches new token when cache is empty      |
| U-16 | `TokenManager.getAccessToken()` | Coalesces concurrent calls into one fetch  |
| U-17 | `TokenManager.invalidate()`     | Clears cache and pendingRequest            |

---

## Integration Tests

| ID   | Scenario                                                                             |
| ---- | ------------------------------------------------------------------------------------ |
| I-01 | Password login: valid credentials → session cookies set → redirect `/login/continue` |
| I-02 | Password login: `401` from backend → inline error, no redirect                       |
| I-03 | Password login: `429` rate limit → rate-limit error message shown                    |
| I-04 | OTP Step 1: valid email → `POST /auth/login/requestotp` called → navigate to verify  |
| I-05 | OTP Step 2: valid 6-digit code → session cookies set → redirect `/login/continue`    |
| I-06 | OTP Step 2: `400` invalid OTP → inline error, OTP input cleared                      |
| I-07 | OTP Step 2: "Resend code" → calls requestOTP again → success toast                   |
| I-08 | Register: valid form → `POST /auth/onboard` → redirect `/login`                      |
| I-09 | Register: `409` conflict → inline email error                                        |
| I-10 | Forgot password: valid email → CheckMailCard shown                                   |
| I-11 | Reset password: valid token + passwords → redirect `/login`                          |
| I-12 | Reset password: `400` expired token → error with link to `/forgot-password`          |
| I-13 | Reset password: missing token in URL → immediate redirect to `/forgot-password`      |
| I-14 | Logout: `DELETE /api/auth/session` called → store cleared → redirect `/login`        |
| I-15 | Logout: DELETE fails (network) → still redirects to `/login` (fail-safe)             |
| I-16 | Token refresh: `401` response → `POST /api/auth/refresh` → original request retried  |
| I-17 | Token refresh: refresh `401` → `DELETE /api/auth/session` → redirect `/login`        |
| I-18 | `useSession()`: loading state while session fetch is in flight                       |
| I-19 | `useSession()`: authenticated state after session fetch succeeds                     |
| I-20 | `useSession()`: unauthenticated state when no session cookie                         |

---

## E2E Tests

| ID   | Scenario                                                                     | Browsers         |
| ---- | ---------------------------------------------------------------------------- | ---------------- |
| E-01 | Password login golden path (valid creds → dashboard)                         | Chrome · Firefox |
| E-02 | Password login error path (invalid creds → inline error)                     | Chrome           |
| E-03 | OTP login golden path (email → code → dashboard)                             | Chrome           |
| E-04 | Registration golden path → redirect to /login                                | Chrome           |
| E-05 | Forgot password → CheckMailCard shown                                        | Chrome           |
| E-06 | Reset password golden path (valid token → /login)                            | Chrome           |
| E-07 | Logout → cookies cleared → /login                                            | Chrome           |
| E-08 | Authenticated user navigating to /login → redirected to dashboard            | Chrome           |
| E-09 | Unauthenticated user navigating to /admin/dashboard → /login?callbackUrl=... | Chrome           |
| E-10 | Non-admin navigating to /admin/\* → /user/dashboard                          | Chrome           |
| E-11 | Token refresh: force 401 → request retried transparently                     | Chrome           |

---

## Accessibility Tests

| ID   | Check                                                                                |
| ---- | ------------------------------------------------------------------------------------ |
| A-01 | No axe violations on `/login`                                                        |
| A-02 | No axe violations on `/register`                                                     |
| A-03 | No axe violations on `/forgot-password`                                              |
| A-04 | No axe violations on `/reset-password`                                               |
| A-05 | No axe violations on `/login/otp` and `/login/otp-verify`                            |
| A-06 | Form errors announced via `aria-live`                                                |
| A-07 | OTP digits individually focusable; auto-advance does not steal focus unexpectedly    |
| A-08 | Password visibility toggle has accessible label                                      |
| A-09 | Submit button communicates loading state (`aria-busy` or visible spinner with label) |

---

## MSW Handlers (Integration)

All integration tests use MSW to mock backend endpoints. Handlers live in
`_sdlc/_testing/fixtures/handlers.ts`. BFF Route Handlers are tested directly
via `fetch` (no MSW needed for them — they run in Vitest's Node environment).

Mock success responses always use the canonical shapes from `api-reference.md`.
