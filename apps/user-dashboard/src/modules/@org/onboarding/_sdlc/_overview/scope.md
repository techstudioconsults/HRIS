---
section: overview
topic: scope
---

# Onboarding — Scope

## In Scope

- **Welcome page** — Introduction and option to take a guided tour.
- **Step 1 — Company Profile** — Edit company name, industry, size, and address.
- **Step 2 — Teams & Roles** — Create teams, add roles to each team with permissions.
- **Step 3 — Employee Onboarding** — Invite founding employees with team/role assignment.
- **Onboarding route guard** — Prevents unauthenticated users accessing onboarding routes.
- **Setup completion tracking** — `OnboardingSetupStatus` persisted per employee via `GET/PATCH /employees/:id/setup`.
- **Tour integration** — Driver.js-based guided tour available from the welcome page.

## Out of Scope

- **Subsequent employee additions** — after onboarding, employees are added via `admin/employee`.
- **Team/role editing post-onboarding** — managed in `admin/teams`.
- **Payroll configuration** — covered in `admin/payroll`.
- **Company logo upload** — not in the onboarding flow.
- **Org chart** — not in scope.

## Constraints

- Onboarding routes (`/onboarding/*`) are accessible only to authenticated users who have not yet completed onboarding. `proxy.ts` redirects authenticated users who have completed onboarding directly to the dashboard.
- All HTTP calls via `OnboardingService` → `HttpAdapter`.
- Steps must be completable independently — partial saves per step are supported.
- The owner cannot skip Step 2 (teams/roles) before proceeding to Step 3 (employees require a team + role to be assigned).
