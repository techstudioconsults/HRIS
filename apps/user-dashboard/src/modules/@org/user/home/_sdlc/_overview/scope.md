# User Home — Scope

_Defines what is included in and explicitly excluded from the employee home dashboard module._

## In Scope

- **Personalised welcome header**: displays the authenticated employee's name and role.
- **Quick-action cards**: Request Leave, View Payslip, View Team — rendered as `QuickActionCard` components with direct navigation links.
- **Recent activities timeline**: a chronological feed of the employee's HR events (`approved`, `rejected`, `available`, `submitted` activity types).
- **Active-user view** (`_views/active-user`): full dashboard rendered for employees whose profile setup is complete.
- **Onboarding view** (`_views/onboarding`): guided setup checklist rendered for new employees who have not completed the four required setup tasks (reset password, review profile, acknowledge policy, review payroll).
- Route: `/user/dashboard`.

## Out of Scope

- Admin-level metrics, team-wide leave calendars, or headcount statistics — those belong in `@org/admin/dashboard`.
- Leave approval or payslip processing logic — those are handled by their respective modules.
- Profile editing — handled by the onboarding module.

## Boundaries

This module owns the `/user/dashboard` route and the `home` feature slice only. It reads data from the leave and payslip services but does not mutate leave or payslip state directly.
