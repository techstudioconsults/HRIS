---
section: architecture
topic: system-design-overview
---

# Onboarding — System Design Overview

## Key Design Decisions

### 1. Page-per-Step Architecture

Each onboarding step is a separate Next.js page. This gives clean URLs, natural back-button support, and isolated form state:

```
/onboarding/welcome   → WelcomeView
/onboarding/step-1    → CompanyProfileView
/onboarding/step-2    → TeamsAndRolesView
/onboarding/step-3    → EmployeeOnboardingView
```

### 2. OnboardingService via DI

All API calls go through `OnboardingService`, consumed via `useOnboardingService()`. This service is registered in the DI container as `ONBOARDING_SERVICE`.

### 3. TanStack Query — Mutations Only (except setup status)

All onboarding operations are mutations (POST, PATCH, DELETE). The only query is `GET /employees/:id/setup` for setup status (used by route guard).

### 4. Accordion-Based Multi-Item Forms

Step 2 (teams/roles) and Step 3 (employees) use accordion panels. Each panel is an independent React Hook Form instance. Adding a team creates a new accordion item; deleting removes it immediately (optimistic or after API confirm).

### 5. Component Architecture

```
WelcomeView
  ├── WelcomeCard
  ├── TakeTourButton          → initializes Driver.js tour
  └── SkipTourButton          → PATCH setup.takenTour = true → /onboarding/step-1

CompanyProfileView
  ├── OnboardingBreadcrumb
  └── CompanyProfileForm      (PATCH /companies/current)

TeamsAndRolesView
  ├── OnboardingBreadcrumb
  ├── TeamConfigAccordion[]   (one per team)
  │   ├── TeamForm            (POST/PATCH/DELETE /teams)
  │   └── RoleConfigAccordion[]
  │       └── RoleForm        (POST/PATCH/DELETE /roles)
  └── AddTeamButton

EmployeeOnboardingView
  ├── OnboardingBreadcrumb
  ├── EmployeeAccordion[]     (one per employee)
  │   └── OnboardEmployeeForm (POST /employees/onboard — batched)
  └── AddEmployeeButton
```

### 6. Navigation Flow

```
/register
  └─▶ /login
        └─▶ /onboarding  (redirect → /onboarding/welcome)
              └─▶ /onboarding/welcome
                    └─▶ /onboarding/step-1
                          └─▶ /onboarding/step-2
                                └─▶ /onboarding/step-3
                                      └─▶ /admin/dashboard
```
