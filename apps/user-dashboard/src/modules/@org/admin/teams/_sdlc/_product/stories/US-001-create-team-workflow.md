---
section: product
topic: user-story
id: US-001
---

# US-001 — Create Team with Role and Employee (Guided Workflow)

## Story

As an admin, I want to create a new team, define a role for it, and assign an employee — all in one guided flow — so that new teams are fully functional immediately after creation.

## Workflow Steps

1. Admin clicks "Create Team" → Team dialog opens (`workflowMode: 'create'`).
2. Admin fills in team name and description → submits.
3. `skipToNextStep` determines whether to advance to Role dialog or stop.
4. If continuing: Role dialog opens with the newly created team pre-selected.
5. Admin defines role name and permissions → submits.
6. Employee dialog opens; admin selects an employee and confirms.
7. Success toast; team table refreshes.

## Acceptance Criteria

- [ ] Team form validates name (2–100 chars) and description (10–500 chars) before submission.
- [ ] On team creation success (201), Zustand `currentTeam` is set and role dialog opens automatically if `skipToNextStep` is false.
- [ ] Role form shows permission checkboxes from `teamPermissions` config.
- [ ] Employee search filters existing org employees (not external email).
- [ ] Entire workflow can be abandoned at any step via "Cancel" without leaving partial data.
- [ ] After completion, `useTeamWorkflowStore.resetWorkflow()` is called.

## Error Cases

| Error                  | UI Behaviour                                     |
| ---------------------- | ------------------------------------------------ |
| `409 TEAM_NAME_EXISTS` | Inline form error on name field                  |
| `400 VALIDATION_ERROR` | Per-field inline errors                          |
| `500 INTERNAL_ERROR`   | Toast: "Something went wrong. Please try again." |
