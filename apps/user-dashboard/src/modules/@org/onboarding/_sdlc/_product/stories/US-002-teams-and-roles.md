---
section: product
topic: user-story
id: US-002
epic: EPIC-001
version: 1.0
created: 2026-04-29
---

# US-002 — Configure Teams and Roles (Step 2)

## Story

As a company owner, I want to configure departments and roles during onboarding so that
employees are assigned to the right structures from day one.

## Acceptance Criteria

- [ ] Step 2 loads any previously created teams from `GET /api/v1/teams` and renders each as an accordion panel.
- [ ] Owner can add a new team via the accordion panel → `POST /api/v1/teams`; the new accordion appears immediately.
- [ ] Owner can rename an existing team → `PATCH /api/v1/teams/:teamId`; the accordion header updates in place.
- [ ] Owner can delete a team that has no active employees → `DELETE /api/v1/teams/:teamId`; accordion is removed from the list.
- [ ] Attempting to delete a team with active employees returns `409`; a destructive error toast is shown and the accordion remains.
- [ ] Owner can add roles under a team → `POST /api/v1/roles`; the new role appears inside the team's accordion.
- [ ] Owner can edit a role's name and permissions → `PATCH /api/v1/roles/:roleId`.
- [ ] Owner can delete a role → `DELETE /api/v1/roles/:roleId`; the role is removed from the accordion.
- [ ] "Continue" button navigates to step-3 (`/onboarding/step-3`).
- [ ] "Back" button navigates to step-1 (`/onboarding/step-1`).
- [ ] Submit buttons are disabled while their respective mutation is in flight.

## Flow

```
/onboarding/step-2
  Render: existing teams from GET /api/v1/teams (accordion list)

  Add Team:
    User enters team name → POST /api/v1/teams
    ← { id, name } → accordion added

  Rename Team:
    User edits team name → PATCH /api/v1/teams/:teamId
    ← { id, name } → accordion header updated

  Delete Team:
    User clicks delete → DELETE /api/v1/teams/:teamId
    ← 204 → accordion removed
    ← 409 → error toast "Cannot delete team with active employees"

  Add Role:
    User enters role name + permissions → POST /api/v1/roles
    ← { id, name, teamId, permissions } → role row added inside team accordion

  Edit Role:
    User edits role → PATCH /api/v1/roles/:roleId → role row updated

  Delete Role:
    User clicks delete → DELETE /api/v1/roles/:roleId → role row removed

  Continue → /onboarding/step-3
  Back    → /onboarding/step-1
```

## Error Cases

| Status | Scenario                       | UI Behaviour                                               |
| ------ | ------------------------------ | ---------------------------------------------------------- |
| `409`  | Team has active employees      | Error toast "Cannot delete a team with active employees"   |
| `422`  | Validation failure (team/role) | Field-level errors on the active accordion panel           |
| `500`  | Server error                   | Root error toast "Something went wrong. Please try again." |
