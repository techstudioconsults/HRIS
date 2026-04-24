---
section: architecture
topic: system-design-overview
---

# Admin Teams — System Design Overview

## Key Design Decisions

### 1. Zustand for Multi-Step Dialog Orchestration

The create-team workflow spans three dialogs (Team → Role → Employee). Passing state via props between these separate components would be brittle. Instead, a Zustand store (`useTeamWorkflowStore`) owns the workflow state:

- `dialog`: which dialog is currently open (`'none' | 'team' | 'role' | 'employee'`)
- `currentTeam`: the team created/edited in the current workflow pass
- `currentRole`: the role created in the current workflow pass
- `workflowMode`: `'create' | 'edit' | 'standalone'`
- `skipToNextStep`: whether the user wants to advance the workflow after each step

This makes the three dialogs independent components that coordinate via shared store, not parent-child coupling.

### 2. TanStack Query for Server State

All team data (list, detail, roles) is managed by TanStack Query:

- `['teams']` — paginated team list
- `['teams', teamId]` — single team detail
- `['teams', teamId, 'roles']` — roles for a team

On any mutation (create, update, delete, assign), the relevant query keys are invalidated to trigger refetch.

### 3. Service Layer via HttpAdapter DI

`TeamService` wraps all API calls and is injected via `useService()` hook — not called directly. This enables mock substitution in tests without MSW.

### 4. Shared Organisation Service

Role CRUD and team-with-roles listing are shared with the onboarding module via `@/modules/@org/shared/organization-service`. This avoids duplicate API logic.

### 5. Export as Blob

Team export returns a `Blob` from `GET /teams/export`. The frontend triggers a programmatic download (`URL.createObjectURL` + `<a>.click()`). No file is stored on the client.

## Component Architecture

```
TeamsPage
├── TeamTableSection          (list + filter + export)
│   └── TeamTable             (paginated rows)
├── TeamDialog                (create/edit — driven by Zustand workflowMode)
├── RoleDialog                (create/edit role for currentTeam)
├── EmployeeDialog            (assign employee to currentTeam)
├── TeamDetailsPage           (drill-in — member roster, sub-teams)
│   └── SubTeamDetailsPage    (nested team view)
└── FilterForm                (search + roleId + teamId filters)
```
