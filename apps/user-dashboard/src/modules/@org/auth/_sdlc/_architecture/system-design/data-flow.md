---
section: architecture
topic: data-flow
---

# Auth — Data Flow

## Password Login Flow

```
Browser (LoginForm)
  └─▶ signIn('credentials', { email, password })
        └─▶ NextAuth API route (/api/auth/signin)
              └─▶ POST /auth/login/password (backend)
              ◀── { employee, tokens, permissions }
        └─▶ NextAuth encodes JWT session cookie
  ◀── Session cookie set (HTTP-only)
  └─▶ router.push(redirectUrl)
```

## OTP Login Flow

```
Browser (OtpLoginForm)
  └─▶ authService.requestOTP({ email })
        └─▶ POST /auth/login/requestotp
        ◀── { success: true }
  └─▶ router.push('/login/otp-verify?email=...')

Browser (InputOtpCard)
  └─▶ authService.loginWithOTP({ email, otp })
        └─▶ POST /auth/login/otp
        ◀── { employee, tokens, permissions }
  └─▶ signIn('credentials', { token: otp }) OR manual session creation
  └─▶ router.push(redirectUrl)
```

## Registration Flow

```
Browser (RegisterForm)
  └─▶ authService.signUp({ companyName, domain, firstName, lastName, email, password })
        └─▶ POST /auth/onboard
        ◀── { success: true, data: "created" }
  └─▶ router.push('/login')
  └─▶ toast "Registration successful — please log in."
```

## Forgot Password Flow

```
Browser (ForgotPasswordForm)
  └─▶ authService.forgotPassword({ email })
        └─▶ POST /auth/forgotpassword
        ◀── { success: true }
  └─▶ Show CheckMailCard
```

## Reset Password Flow

```
Browser (ResetPasswordForm)
  └─▶ authService.resetPassword({ password, confirmPassword, token })
        └─▶ POST /auth/resetpassword (token from URL query param)
        ◀── { success: true }
  └─▶ router.push('/login')
  └─▶ toast "Password reset successfully."
```

## Token Refresh Flow (Background)

```
HttpAdapter receives 401 on any request
  └─▶ tokenManager.refreshAccessToken()
        └─▶ POST /auth/refresh (or NextAuth session update)
        ◀── new { accessToken, refreshToken }
  └─▶ Retry original request with new access token
  ─── If refresh also fails:
        └─▶ tokenManager.invalidate()
        └─▶ signOut({ redirect: false })
        └─▶ redirectToLogin()
```
