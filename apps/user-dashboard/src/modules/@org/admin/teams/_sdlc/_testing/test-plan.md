---
section: testing
topic: test-plan
---

# Admin Teams — Test Plan

## Unit Tests

| Target                 | Cases                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CreateTeamSchema`     | valid input; name too short (<2); name too long (>100); description too short (<10)                                                                       |
| `CreateRoleSchema`     | valid input; name missing; no permissions selected                                                                                                        |
| `AssignEmployeeSchema` | valid input; no employee selected; no role selected                                                                                                       |
| `useTeamWorkflowStore` | initial state; `openTeamDialog` sets dialog + mode; `openRoleDialog` carries currentTeam; `closeDialog` resets skipToNextStep; `resetWorkflow` clears all |

## Integration Tests (MSW + RTL)

| Flow                        | Scenarios                                                    |
| --------------------------- | ------------------------------------------------------------ |
| Teams list load             | Fetches on mount; rows render; empty state shown if no teams |
| Create team                 | POST success → 201; team added to list                       |
| Create team — name conflict | 409 TEAM_NAME_EXISTS; inline error on name field             |
| Edit team                   | PATCH success; row updates                                   |
| Delete team — success       | DELETE 200; row removed                                      |
| Delete team — has members   | 409 TEAM_HAS_MEMBERS; toast shown                            |
| Create role                 | POST to `/teams/:id/roles`; role appears in list             |
| Create role — duplicate     | 409 ROLE_NAME_EXISTS; inline error                           |
| Assign employee             | POST to `/teams/:id/employees`; success toast                |
| Assign duplicate member     | 409 MEMBER_ALREADY_EXISTS; toast shown                       |
| Export                      | GET `/teams/export`; file download triggered                 |

## E2E Tests (Playwright)

| Path                 | Scenario                                           |
| -------------------- | -------------------------------------------------- |
| `/admin/teams`       | List loads; search filters rows                    |
| Full create workflow | Team → Role → Employee; all three dialogs complete |
| Edit team            | Open edit dialog; change name; verify update       |
| Delete team          | Open delete confirm; confirm; team removed         |
| ADMIN guard          | Non-admin redirected away from `/admin/teams`      |
| Keyboard navigation  | Tab through table and action buttons               |

## Accessibility Checks

- Team/member status badges use text + colour (WCAG 1.4.1).
- Permission checkboxes grouped with `<fieldset>` + `<legend>`.
- Dialogs trap focus; restore on close.
- All form inputs have associated `<label>`.
- Filter form accessible by keyboard.
