---
section: product
topic: roadmap
---

# Auth — Product Roadmap

## Current (v1)

- [x] Password login via NextAuth credentials
- [x] OTP login (request + verify)
- [x] Company owner registration
- [x] Forgot password (email dispatch)
- [x] Reset password (token-validated)
- [x] JWT session management with auto-refresh
- [x] Route protection via proxy.ts middleware

## Near-Term (v1.1)

- [ ] Google OAuth login (backend endpoint exists; UI wiring needed)
- [ ] "Remember me" — extended session lifetime (currently always 24h)
- [ ] OTP resend cooldown with visual countdown

## Future

- [ ] MFA / TOTP (authenticator app)
- [ ] Magic link login (passwordless)
- [ ] SSO / SAML for enterprise tenants
- [ ] Login activity log (last login, device, IP)
- [ ] Account lockout notification email
