# EPIC-001 — Settings Core: Organisation Configuration Hub

_Deliver a complete, tab-organised settings interface covering all organisation-scoped configuration panels._

## Goal

Provide HR admins with a single screen to configure all organisation-level HRIS settings across six tabs: Account, Payroll, Security, HR, Notifications, and Roles Management.

## Business Value

- Eliminates fragmented configuration spread across multiple pages.
- Empowers HR admins to self-serve configuration without requiring developer intervention.
- Roles Management tab enables custom access control that scales beyond the default 4-role system.
- Audit trail on all settings changes satisfies compliance requirements.

## Acceptance Criteria (high level)

- [ ] All six settings tabs are accessible from the Settings landing page.
- [ ] Each tab loads its current settings from the API and pre-populates the form.
- [ ] Each tab saves independently with success/error feedback.
- [ ] Account Settings: org name, logo, contact info persist correctly.
- [ ] Payroll Settings: pay cycle, currency, deductions save and validate correctly.
- [ ] Security Settings: 2FA enforcement toggle, session timeout, password policy save correctly.
- [ ] HR Settings: working hours, probation period, leave carryover rules save correctly.
- [ ] Notification Settings: per-event email/in-app toggles save correctly.
- [ ] Roles Management: create, edit, delete custom roles with permission assignment.
- [ ] All changes are audited with `updatedBy` and `updatedAt`.

## User Stories

- US-001 — Update organisation account details
- US-002 — Configure payroll pay cycle and currency
- US-003 — Enable or disable 2FA enforcement
- US-004 — Set session timeout policy
- US-005 — Configure leave carryover rules
- US-006 — Create a custom role with permissions
- US-007 — Manage notification preferences

## Dependencies

- Backend: `/api/v1/settings/*` endpoints per settings domain.
- Auth: JWT with `admin:settings:write` permission scope.

## Estimated Effort

| Phase                        | Estimate |
| ---------------------------- | -------- |
| Architecture & API contracts | 1 day    |
| Backend (6 settings domains) | 5 days   |
| Frontend (6 tabs)            | 5 days   |
| Testing & review             | 2 days   |
