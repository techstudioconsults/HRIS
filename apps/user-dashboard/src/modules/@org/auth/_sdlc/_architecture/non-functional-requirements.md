---
section: architecture
topic: non-functional-requirements
---

# Auth — Non-Functional Requirements

## Performance

| Metric                                       | Target                                    |
| -------------------------------------------- | ----------------------------------------- |
| Password login response (submit → dashboard) | < 2s (p95)                                |
| OTP request delivery confirmation            | < 1s (UI confirmation; delivery is async) |
| OTP verification + session establishment     | < 1.5s                                    |
| Token silent refresh (background)            | < 500ms; invisible to user                |
| Forgot password email trigger                | < 1s (UI confirmation)                    |

## Security

- Credentials (email, password) are never logged or stored in client state.
- Auth tokens are stored only in NextAuth's HTTP-only cookie — never `localStorage` or `sessionStorage`.
- Password fields never appear in URLs or query strings.
- Reset tokens are single-use; expiry enforced by the backend.
- OTP is rate-limited on the backend; the UI surfaces rate-limit errors clearly.
- All auth endpoints are HTTPS-only in production.

## Accessibility

- All forms keyboard-navigable (Tab, Enter, Shift+Tab).
- Form errors announced via `aria-live` or `role="alert"`.
- Password visibility toggle meets WCAG 2.1 AA (button with label, not icon-only).
- OTP input digits individually focusable; auto-advance on digit entry.
- WCAG 2.1 AA minimum throughout.

## Reliability

- Session silent refresh retries once before signing out.
- If the refresh endpoint is unavailable (503), the user is signed out gracefully with a clear message.
- Auth mutations retry 0 times — user-visible errors are shown immediately; let the user retry.

## Observability

- All auth mutation errors are logged at the server level (Next.js route handlers / NextAuth callbacks).
- No PII (email, password fragments) appears in client-side logs or error messages sent to monitoring.
