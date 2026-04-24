# Settings Module — Scope

_Defines what is in and out of scope for the organisation settings hub._

## In Scope

- **Account Settings**: organisation name, logo upload, contact email, phone, address, registration number.
- **Payroll Settings**: pay cycle (weekly/bi-weekly/monthly), default currency, standard deductions configuration (tax, pension, health insurance).
- **Security Settings**: two-factor authentication enforcement policy, session timeout duration, password complexity policy (minimum length, character requirements, expiry interval).
- **HR Settings**: standard working hours per week, probation period duration, leave carryover rules (maximum days carried, expiry date), public holiday calendar selection.
- **Notification Settings**: toggle email and in-app notifications per event type (new leave request, payroll run completed, contract expiry, onboarding checklist completed).
- **Roles Management**: create custom roles, assign permission scopes to each role, edit and delete custom roles, view system-defined roles (read-only).

## Out of Scope (v1)

- Individual user preferences (notification preferences per user are a profile concern, not org settings).
- Multi-organisation management (switching between orgs is an auth/super-admin concern).
- Billing and subscription settings.
- SSO / SAML configuration (planned for a future Security Settings extension).
- API key management.

## Boundary Conditions

- All settings are organisation-scoped — the `organisationId` is always derived from the JWT, never from the request body.
- System-defined roles (Super Admin, HR Manager, HR Officer, Employee) are read-only in the UI; only custom roles can be created, edited, or deleted.
- Payroll settings changes take effect from the next pay cycle, not retroactively.
