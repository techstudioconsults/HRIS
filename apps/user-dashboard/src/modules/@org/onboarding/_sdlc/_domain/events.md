---
section: domain
topic: events
---

# Onboarding — Domain Events

## Wizard Navigation Events

| Event                              | Trigger                          | Consumer    | Effect                              |
| ---------------------------------- | -------------------------------- | ----------- | ----------------------------------- |
| `onboarding.welcome.tourStarted`   | User clicks "Take Tour"          | WelcomeView | Driver.js tour initializes          |
| `onboarding.welcome.tourSkipped`   | User clicks "Skip" or "Continue" | WelcomeView | router.push('/onboarding/step-1')   |
| `onboarding.welcome.tourCompleted` | Driver.js tour finishes          | WelcomeView | PATCH setup.takenTour=true → step-1 |

## Step 1 — Company Profile Events

| Event                           | Trigger                           | Consumer           | Effect                                                 |
| ------------------------------- | --------------------------------- | ------------------ | ------------------------------------------------------ |
| `onboarding.company.saved`      | PATCH /companies/current succeeds | CompanyProfileForm | Toast "Company profile saved."; router.push('/step-2') |
| `onboarding.company.saveFailed` | PATCH returns 4xx/5xx             | CompanyProfileForm | Inline form errors                                     |

## Step 2 — Teams & Roles Events

| Event                          | Trigger                            | Consumer            | Effect                                      |
| ------------------------------ | ---------------------------------- | ------------------- | ------------------------------------------- |
| `onboarding.team.created`      | POST /teams succeeds               | TeamsAndRolesView   | Add team to local state; open new accordion |
| `onboarding.team.updated`      | PATCH /teams/:id succeeds          | TeamForm            | Update team name in local state             |
| `onboarding.team.deleted`      | DELETE /teams/:id succeeds         | TeamsAndRolesView   | Remove team from local state                |
| `onboarding.team.deleteFailed` | DELETE returns 409 (has employees) | TeamConfigAccordion | Toast error message                         |
| `onboarding.role.created`      | POST /roles succeeds               | RoleConfigAccordion | Add role to team.roles in local state       |
| `onboarding.role.updated`      | PATCH /roles/:id succeeds          | RoleForm            | Update role in local state                  |
| `onboarding.role.deleted`      | DELETE /roles/:id succeeds         | RoleConfigAccordion | Remove role from local state                |

## Step 3 — Employee Onboarding Events

| Event                               | Trigger                          | Consumer                               | Effect                                                      |
| ----------------------------------- | -------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `onboarding.employees.invited`      | POST /employees/onboard succeeds | EmployeeOnboardingView                 | Toast "Employees invited."; router.push('/admin/dashboard') |
| `onboarding.employees.inviteFailed` | POST returns 409/422             | EmployeeAccordion                      | Per-employee field errors                                   |
| `onboarding.complete`               | Dashboard visit after invite     | MarkOnboardingCompleteOnDashboardVisit | PATCH setup.takenTour=true                                  |
