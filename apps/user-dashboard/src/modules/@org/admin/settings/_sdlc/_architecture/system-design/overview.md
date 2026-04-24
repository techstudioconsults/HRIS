# Settings Module — System Design Overview

_High-level description of how the settings hub is architected._

## Module Boundaries

The Settings module (`@org/admin/settings`) is a self-contained frontend feature module. It communicates with the backend via the `HttpAdapter` abstraction. Six distinct settings domains each have their own service function, hook, and Zod schema. Shared UI comes from `@org/ui`.

## Layering

```
_views/
  SettingsView           ← page shell, active tab routing
  ├── AccountSettingsTab
  ├── PayrollSettingsTab
  ├── SecuritySettingsTab
  ├── HRSettingsTab
  ├── NotificationSettingsTab
  └── RolesManagementTab
    ├── RolesList        ← list of roles with edit/delete
    └── RoleEditorDrawer ← create/edit role + permission checkboxes
hooks/
  useAccountSettings     usePayrollSettings   useSecuritySettings
  useHRSettings          useNotificationSettings   useRoles
services/
  settings-service.ts    roles-service.ts
types/
  settings.types.ts      roles.types.ts      settings.schemas.ts
```

## Key Design Decisions

1. **One hook per settings tab** — each tab fetches and mutates its own settings slice independently.
2. **Form per tab** — React Hook Form instance is scoped to each tab; no cross-tab form state.
3. **Tab routing via URL param** (`?tab=account`) — survives page refresh, enables deep links.
4. **Roles as a sub-feature** — `RolesManagementTab` has its own sub-components and hooks because it involves CRUD beyond simple key-value settings.
5. **No global settings store** — settings values live in TanStack Query cache; no Zustand needed.

## Technology Choices

| Concern               | Choice                             | Reason                                             |
| --------------------- | ---------------------------------- | -------------------------------------------------- |
| Forms                 | React Hook Form + Zod              | Consistent with project pattern; per-tab schemas   |
| Server state          | TanStack Query                     | Auto-stale, background refetch, cache invalidation |
| Logo upload           | `FormData` via `HttpAdapter`       | Same pattern as Resources file upload              |
| Permission checkboxes | Controlled via RHF `useFieldArray` | Dynamic list of permission scopes                  |
