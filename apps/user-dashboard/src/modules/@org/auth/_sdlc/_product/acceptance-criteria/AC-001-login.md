---
section: product
topic: acceptance-criteria
id: AC-001
---

# AC-001 — Login Acceptance Criteria

## Password Login

| #   | Criterion                                                                          | Verified |
| --- | ---------------------------------------------------------------------------------- | -------- |
| 1   | Submitting valid email+password redirects to dashboard within 2s                   | ☐        |
| 2   | Submitting invalid password shows "Invalid email or password." without page reload | ☐        |
| 3   | Submit button shows spinner and is disabled during request                         | ☐        |
| 4   | Email field retains value on failed login                                          | ☐        |
| 5   | Password field clears on failed login                                              | ☐        |
| 6   | Pressing Enter in any field submits the form                                       | ☐        |
| 7   | Authenticated user visiting /login is redirected to dashboard                      | ☐        |

## OTP Login

| #   | Criterion                                                             | Verified |
| --- | --------------------------------------------------------------------- | -------- |
| 8   | Submitting email triggers OTP and navigates to /login/otp-verify      | ☐        |
| 9   | OTP input accepts exactly 6 digits, auto-advances between fields      | ☐        |
| 10  | Paste of 6-digit code fills all fields                                | ☐        |
| 11  | Submitting correct OTP establishes session and redirects to dashboard | ☐        |
| 12  | Expired OTP shows "Your code has expired. Request a new one."         | ☐        |
| 13  | Resend button is disabled for 60s after request                       | ☐        |

## Registration

| #   | Criterion                                                           | Verified |
| --- | ------------------------------------------------------------------- | -------- |
| 14  | All required fields validated before submit                         | ☐        |
| 15  | Password and confirm password must match                            | ☐        |
| 16  | Successful registration shows toast and redirects to /login         | ☐        |
| 17  | Duplicate email shows field-level error "Email already registered." | ☐        |

## Forgot / Reset Password

| #   | Criterion                                                             | Verified |
| --- | --------------------------------------------------------------------- | -------- |
| 18  | Submitting email shows CheckMailCard                                  | ☐        |
| 19  | Non-existent email shows generic success (no enumeration attack)      | ☐        |
| 20  | Reset form validates new password matches confirm                     | ☐        |
| 21  | Successful reset shows toast and redirects to /login                  | ☐        |
| 22  | Expired reset token shows "This link has expired. Request a new one." | ☐        |
