---
section: architecture
topic: sequence-diagram-error-flow
---

# Onboarding — Error Flows

## Company Profile Save — Validation Error (422)

```
Browser        CompanyProfileForm   OnboardingService   Backend API
   |                   |                   |                 |
   |-- submit ────────▶|                   |                 |
   |                   |-- updateCompany() ▶|                 |
   |                   |                   |-- PATCH /companies/current ──▶|
   |                   |                   |◀── 422 { errors: [{ field, message }] }
   |                   |◀── error ─────────|                 |
   |                   |-- map errors to form.setError(field, message)
   |◀── field-level errors displayed
```

## Team Delete — Team Has Employees (409)

```
Browser        DeleteTeamButton   OnboardingService   Backend API
   |                 |                 |                  |
   |-- click ───────▶|                 |                  |
   |                 |-- deleteTeam()─▶|                  |
   |                 |                 |-- DELETE /teams/:id ──▶|
   |                 |                 |◀── 409 { title: "Team has active employees" }
   |                 |◀── error ───────|                  |
   |                 |-- toast "This team has employees and cannot be deleted."
   |◀── toast displayed; accordion unchanged
```

## Employee Onboard — Duplicate Email (409)

```
Browser        FinishButton   OnboardingService   Backend API
   |               |               |                  |
   |-- click ─────▶|               |                  |
   |               |-- onboardEmployees() ─────────────▶|
   |               |               |◀── 409 { title: "Email already exists", field: "employees[1].email" }
   |               |◀── error ─────|                  |
   |               |-- show inline error on affected employee form
   |◀── error shown; other employee forms unchanged
```
