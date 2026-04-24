---
section: architecture
topic: state-management
---

# Admin Teams — State Management

## TanStack Query — Cache Keys

| Key                          | Query                                       | Stale Time    |
| ---------------------------- | ------------------------------------------- | ------------- |
| `['teams']`                  | `GET /teams` (paginated)                    | default (60s) |
| `['teams', teamId]`          | `GET /teams/:id`                            | default       |
| `['teams', teamId, 'roles']` | `GET /teams/:id/roles` (via shared service) | default       |

Mutations invalidate:

- Create team → `['teams']`
- Update/delete team → `['teams']`, `['teams', teamId]`
- Create/update role → `['teams', teamId, 'roles']`
- Assign employee → `['teams', teamId]`

## Zustand — Team Workflow Store

```ts
interface TeamWorkflowState {
  currentTeam: TeamFormType | null; // team in-flight in current workflow
  currentRole: FormRole | null; // role in-flight in current workflow
  dialog: 'none' | 'team' | 'role' | 'employee';
  isSubmitting: boolean;
  workflowMode: 'create' | 'edit' | 'standalone';
  skipToNextStep: boolean; // true = advance to next dialog after submit
}
```

### Transition Rules

| Action                           | Dialog transition | State change                                    |
| -------------------------------- | ----------------- | ----------------------------------------------- |
| `openTeamDialog(null, 'create')` | → `'team'`        | `currentTeam = null`, `workflowMode = 'create'` |
| `openTeamDialog(team, 'edit')`   | → `'team'`        | `currentTeam = team`, `workflowMode = 'edit'`   |
| `openRoleDialog(team)`           | → `'role'`        | `currentTeam = team`                            |
| `openEmployeeDialog(team)`       | → `'employee'`    | `currentTeam = team`                            |
| `closeDialog()`                  | → `'none'`        | `skipToNextStep = false`                        |
| `resetWorkflow()`                | → `'none'`        | full reset                                      |

### No Persistence

The store has no `persist` middleware — workflow state is session-only and never written to `localStorage`.

## Local Form State

Each dialog manages its own form state via React Hook Form. Forms do not share state with the Zustand store — only the submitted values (team/role identifiers) are propagated back to the store after a successful API call.
