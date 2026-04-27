---
section: architecture
topic: sequence-diagram-login-flow
version: 2.0
updated: 2026-04-26
---

# Auth — Login Flow (Sequence Diagrams) — v2 Custom Session

> NextAuth removed (ADR-002). Session established via BFF Route Handlers.

---

## Password Login — Happy Path

```mermaid
sequenceDiagram
  actor User
  participant LoginView
  participant AuthService
  participant Backend as Backend API<br/>POST /auth/login/password
  participant BFF as BFF Route Handler<br/>POST /api/auth/session
  participant Cookies as HTTP-only Cookies

  User->>LoginView: email + password → submit
  LoginView->>LoginView: Zod validate
  LoginView->>AuthService: loginWithPassword({ email, password })
  AuthService->>Backend: POST /auth/login/password
  Backend-->>AuthService: { employee, tokens, permissions }
  AuthService-->>LoginView: data
  LoginView->>BFF: POST /api/auth/session
  BFF->>Cookies: Set __hris_at · __hris_rt · __hris_meta
  BFF-->>LoginView: { ok: true }
  LoginView->>LoginView: router.push('/login/continue')
```

---

## OTP Login — Happy Path

```mermaid
sequenceDiagram
  actor User
  participant OtpView as OtpLoginView<br/>/login/otp
  participant OtpCard as InputOtpCard<br/>/login/otp-verify
  participant AuthService
  participant Backend as Backend API
  participant BFF as BFF Route Handler<br/>POST /api/auth/session
  participant Cookies as HTTP-only Cookies

  User->>OtpView: Enter email → submit
  OtpView->>AuthService: requestOTP({ email })
  AuthService->>Backend: POST /auth/login/requestotp
  Backend--)User: OTP email sent
  Backend-->>AuthService: { success: true }
  OtpView->>OtpView: router.push('/login/otp-verify?email=...')

  User->>OtpCard: Enter 6-digit code → submit
  OtpCard->>AuthService: loginWithOTP({ email, password: otpCode })
  AuthService->>Backend: POST /auth/login/otp
  Backend-->>AuthService: { employee, tokens, permissions }
  OtpCard->>BFF: POST /api/auth/session
  BFF->>Cookies: Set __hris_at · __hris_rt · __hris_meta
  BFF-->>OtpCard: { ok: true }
  OtpCard->>OtpCard: router.push('/login/continue')
```

---

## Token Refresh on 401

```mermaid
sequenceDiagram
  participant Interceptor as Axios Interceptor
  participant TokenMgr as TokenManager
  participant RefreshBFF as POST /api/auth/refresh
  participant Cookies as HTTP-only Cookies
  participant Backend as POST /auth/refresh

  Interceptor->>Interceptor: 401 received (_retried=false)
  Interceptor->>TokenMgr: refreshAccessToken()
  TokenMgr->>RefreshBFF: POST /api/auth/refresh
  RefreshBFF->>Cookies: Read __hris_rt
  RefreshBFF->>Backend: POST /auth/refresh { refreshToken }
  Backend-->>RefreshBFF: { accessToken, refreshToken }
  RefreshBFF->>Cookies: Rotate __hris_at · __hris_rt · __hris_meta
  RefreshBFF-->>TokenMgr: { accessToken, expiresAt }
  TokenMgr-->>Interceptor: new accessToken
  Interceptor->>Interceptor: Retry original request with Bearer <newToken>
```

---

## Logout

```mermaid
sequenceDiagram
  actor User
  participant TopBar
  participant useLogout
  participant BFF as DELETE /api/auth/session
  participant Cookies as HTTP-only Cookies
  participant TokenMgr as TokenManager
  participant Store as useAuthStore

  User->>TopBar: Click Sign Out
  TopBar->>useLogout: logout()
  useLogout->>BFF: DELETE /api/auth/session
  BFF->>Cookies: Clear __hris_at · __hris_rt · __hris_meta
  BFF-->>useLogout: { ok: true }
  useLogout->>TokenMgr: invalidate()
  useLogout->>Store: logout()
  useLogout->>useLogout: queryClient.clear()
  useLogout->>useLogout: router.push('/login')
```
