---
section: testing
topic: test-plan
---

# Auth — Test Plan

## Scope

| Layer         | Tool                                  | Coverage Target                       |
| ------------- | ------------------------------------- | ------------------------------------- |
| Unit          | Vitest                                | Zod schema validation, pure functions |
| Integration   | Vitest + RTL + MSW                    | Form submission flows with mocked API |
| E2E           | Playwright                            | Golden path for each auth flow        |
| Accessibility | axe-core (via `@axe-core/playwright`) | WCAG 2.1 AA                           |

## Test Scenarios

### Unit Tests

| ID   | Scenario                                           |
| ---- | -------------------------------------------------- |
| U-01 | `loginSchema` accepts valid email + password       |
| U-02 | `loginSchema` rejects empty password               |
| U-03 | `registerSchema` rejects mismatched passwords      |
| U-04 | `registerSchema` rejects invalid email format      |
| U-05 | `resetPasswordSchema` rejects mismatched passwords |
| U-06 | `forgotPasswordSchema` rejects non-email           |

### Integration Tests

| ID   | Scenario                                                 |
| ---- | -------------------------------------------------------- |
| I-01 | Valid login form submission calls signIn and redirects   |
| I-02 | Invalid credentials shows inline error                   |
| I-03 | Rate-limited response shows rate-limit error message     |
| I-04 | OTP request form submits email and navigates to verify   |
| I-05 | OTP verify with correct OTP establishes session          |
| I-06 | OTP verify with expired OTP shows error                  |
| I-07 | Register form submits and navigates to /login on success |
| I-08 | Register with duplicate email shows field error          |
| I-09 | Forgot password shows CheckMailCard on submit            |
| I-10 | Reset password with valid token navigates to /login      |
| I-11 | Reset password with expired token shows error            |

### E2E Tests

| ID   | Scenario                                                      |
| ---- | ------------------------------------------------------------- |
| E-01 | Password login golden path (valid creds → dashboard)          |
| E-02 | Password login error (invalid creds)                          |
| E-03 | OTP login golden path                                         |
| E-04 | Registration golden path                                      |
| E-05 | Forgot + reset password golden path                           |
| E-06 | Authenticated user visiting /login redirected to dashboard    |
| E-07 | Unauthenticated user visiting /dashboard redirected to /login |

### Accessibility

| ID   | Check                                                     |
| ---- | --------------------------------------------------------- |
| A-01 | No axe violations on /login                               |
| A-02 | No axe violations on /register                            |
| A-03 | Form errors announced via aria-live                       |
| A-04 | OTP digits individually focusable, auto-advance announced |
| A-05 | Password visibility toggle has accessible label           |
