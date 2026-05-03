---
section: product
topic: user-story
id: US-003
epic: EPIC-001
version: 1.0
created: 2026-04-29
---

# US-003 — Invite Employees (Step 3)

## Story

As a company owner, I want to invite employees during onboarding so that they can access
the platform from day one.

## Acceptance Criteria

- [ ] Step 3 renders an accordion; each panel is a single-employee form.
- [ ] The team dropdown is populated from the teams created in step 2.
- [ ] Selecting a team filters the role dropdown to show only that team's roles.
- [ ] Owner can add more employee panels via an "Add Employee" action.
- [ ] All employee forms are submitted as a batch via `POST /api/v1/employees/onboard`.
- [ ] On success: toast confirmation and navigate to `/admin/dashboard`.
- [ ] A `409` conflict (duplicate email) returns a field-level error on the affected employee's email field.
- [ ] "Back" button navigates to step-2 (`/onboarding/step-2`).
- [ ] Submit button is disabled while the batch request is in flight.

## Flow

```
/onboarding/step-3
  Render: accordion with one employee form panel

  Team Dropdown:
    Options sourced from teams created in step 2
    On team selection → role dropdown filtered to that team's roles

  Add Employee:
    User clicks "Add Employee" → new accordion panel appended

  Submit All:
    User fills all panels → POST /api/v1/employees/onboard { employees: [...] }
    ← 201 { invited: N } → toast success → redirect /admin/dashboard
    ← 409 { errors: [{ field: 'employees[n].email', message }] }
              → field-level error on affected email input

  Back → /onboarding/step-2
```

## Error Cases

| Status | Scenario           | UI Behaviour                                               |
| ------ | ------------------ | ---------------------------------------------------------- |
| `409`  | Duplicate email    | Field-level error on the affected employee's email input   |
| `422`  | Validation failure | Field-level errors on the offending employee's form fields |
| `500`  | Server error       | Root error toast "Something went wrong. Please try again." |
