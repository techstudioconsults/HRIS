---
section: architecture
topic: component-tree
---

# Onboarding — Component Tree

```
/onboarding/welcome
└── WelcomeView                          ("use client")
    ├── WelcomeCard                      (hero message + company name)
    ├── TakeTourButton                   → initializes Driver.js tour
    └── SkipTourButton / ContinueButton  → router.push('/onboarding/step-1')

/onboarding/step-1
└── CompanyProfileView                   ("use client" — form interaction)
    ├── OnboardingBreadcrumb             (step 1 active)
    └── CompanyProfileForm
        ├── NameField
        ├── IndustrySelect
        ├── SizeSelect
        ├── AddressLine1Field
        ├── AddressLine2Field
        ├── CityField
        ├── StateField
        ├── CountrySelect
        ├── PostcodeField
        └── NextButton                   → PATCH /companies/current → /step-2

/onboarding/step-2
└── TeamsAndRolesView                    ("use client")
    ├── OnboardingBreadcrumb             (step 2 active)
    ├── TeamConfigAccordion[]            (one per team — fetched + local state)
    │   ├── TeamAccordionHeader          (team name, edit/delete buttons)
    │   ├── TeamForm                     (name field → PATCH /teams/:id)
    │   └── RoleConfigAccordion[]
    │       ├── RoleAccordionHeader      (role name, permissions, edit/delete)
    │       └── RoleForm                 (name + permissions checkboxes → POST/PATCH /roles)
    ├── AddTeamButton                    → POST /teams → adds accordion item
    └── NextButton                       → /step-3 (requires ≥1 team with ≥1 role)

/onboarding/step-3
└── EmployeeOnboardingView               ("use client")
    ├── OnboardingBreadcrumb             (step 3 active)
    ├── EmployeeAccordion[]              (one per invited employee)
    │   ├── EmployeeAccordionHeader      (name/email, remove button)
    │   └── OnboardEmployeeForm
    │       ├── FirstNameField
    │       ├── LastNameField
    │       ├── EmailField
    │       ├── PhoneNumberField
    │       ├── PasswordField            (initial password set by owner)
    │       ├── TeamSelect               (populated from Step 2 teams)
    │       └── RoleSelect               (filtered by selected team)
    ├── AddEmployeeButton
    └── FinishButton                     → POST /employees/onboard → /admin/dashboard
```

## Shared Components

| Component                                | Purpose                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `OnboardingBreadcrumb`                   | Step indicator — shows Welcome / Step 1 / Step 2 / Step 3 with active state |
| `OnboardingRouteGuard`                   | Verifies authenticated session on each onboarding page                      |
| `MarkOnboardingCompleteOnDashboardVisit` | Patches `takenTour=true` when owner first visits dashboard                  |
