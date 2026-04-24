---
section: architecture
topic: ADR
id: ADR-001
status: accepted
---

# ADR-001 — Zustand for Multi-Dialog Workflow + Shared Organisation Service

## Context

The team creation flow spans three sequential dialogs: Team, Role, Employee. These dialogs need to share the newly-created team identity between steps without being parent-child components. Additionally, role and team-with-roles logic is also needed by the onboarding module.

## Decision

1. **Zustand for workflow orchestration**: `useTeamWorkflowStore` owns `currentTeam`, `currentRole`, `dialog`, and `workflowMode`. Dialogs read from the store and dispatch transitions via store actions, not prop callbacks.

2. **Shared organisation service**: `getTeamsWithRoles`, `getRoles`, `createRole`, `updateRole` are extracted into `@/modules/@org/shared/organization-service`. Both the teams module and the onboarding module consume these shared functions.

3. **`multipart/form-data` for team create/update**: Team create and update use `FormData` (not JSON) to support future image/logo uploads without an API contract change.

## Consequences

- **Pro**: Dialogs are decoupled — each is a standalone component that can be opened independently (standalone mode).
- **Pro**: Role logic changes in one place propagate to both teams and onboarding.
- **Con**: Shared service creates a coupling between teams and onboarding modules — changes to the shared service must not break either caller.
- **Con**: `multipart/form-data` requires MSW handlers to parse `FormData`, not JSON.
