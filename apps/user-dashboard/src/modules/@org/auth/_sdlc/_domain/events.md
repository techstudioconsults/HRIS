---
section: domain
topic: events
---

# Auth — Domain Events

## Auth Lifecycle Events

| Event                          | Trigger                               | Consumer                | Effect                                          |
| ------------------------------ | ------------------------------------- | ----------------------- | ----------------------------------------------- |
| `auth.login.initiated`         | User submits login form               | LoginForm               | Sets mutation isPending, disables submit        |
| `auth.login.succeeded`         | NextAuth session established          | LoginForm, AuthStore    | Populate useAuthStore; router push to dashboard |
| `auth.login.failed`            | Backend returns 401/422               | LoginForm               | `form.setError('root', message)`                |
| `auth.otp.requested`           | requestOTP succeeds                   | OtpLoginForm            | Navigate to /login/otp-verify                   |
| `auth.otp.verified`            | loginWithOTP succeeds                 | OtpVerifyView           | Session established; router push to dashboard   |
| `auth.otp.expired`             | loginWithOTP returns 400 OTP expired  | InputOtpCard            | Error shown; resend button highlighted          |
| `auth.register.succeeded`      | signUp returns 201                    | RegisterForm            | Toast; router.push('/login')                    |
| `auth.register.failed`         | signUp returns 409 or 422             | RegisterForm            | Inline field or root error shown                |
| `auth.forgotPassword.sent`     | forgotPassword returns 200            | ForgotPasswordView      | Render CheckMailCard                            |
| `auth.resetPassword.succeeded` | resetPassword returns 200             | ResetPasswordForm       | Toast; router.push('/login')                    |
| `auth.session.expired`         | HttpAdapter 401 + refresh fails       | HttpAdapter interceptor | signOut + redirectToLogin                       |
| `auth.logout.completed`        | `signOut()` + `useAuthStore.logout()` | Layout/Navbar           | Clear store; redirect /login                    |

## Upstream Events Consumed

| Event                  | Source                        | How Auth Responds                                                     |
| ---------------------- | ----------------------------- | --------------------------------------------------------------------- |
| 401 on any API call    | HttpAdapter                   | Refresh attempt; sign out if refresh fails                            |
| Session cookie cleared | NextAuth (tab close / expiry) | User appears logged out on next navigation; proxy redirects to /login |
