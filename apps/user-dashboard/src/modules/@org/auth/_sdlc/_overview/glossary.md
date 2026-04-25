---
section: overview
topic: glossary
---

# Auth — Glossary

| Term                        | Definition                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **NextAuth**                | The authentication library managing sessions, JWT cookies, and the credentials provider for password login.                                     |
| **Credentials Provider**    | NextAuth's built-in mechanism for email/password login; calls `/auth/login/password` on the backend.                                            |
| **Access Token**            | Short-lived JWT sent as `Authorization: Bearer` on every API request.                                                                           |
| **Refresh Token**           | Long-lived token used to obtain a new access token when the current one expires.                                                                |
| **Session**                 | A NextAuth-managed JWT cookie containing `employee`, `tokens`, and `permissions`.                                                               |
| **OTP**                     | One-time password sent to the user's email; valid for a limited time window.                                                                    |
| **tokenManager**            | Client-side utility that reads/writes tokens from the NextAuth session for use by the HttpAdapter.                                              |
| **HttpAdapter interceptor** | The Axios response interceptor that catches 401 errors, attempts a token refresh, and retries the original request before signing the user out. |
| **proxy.ts**                | Next.js middleware that runs on every request, checks authentication state, and enforces route-level access control.                            |
| **Owner**                   | The company administrator who registers the company and completes the onboarding flow.                                                          |
| **RBAC**                    | Role-Based Access Control — the permission system that determines what each user role can do.                                                   |
| **Domain**                  | The company's unique subdomain identifier used during registration.                                                                             |
| **Reset Token**             | A time-limited token embedded in the password reset email link; validated by `/auth/resetpassword`.                                             |
