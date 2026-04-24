# ADR-001 — Settings Module Initial Architecture

**Status**: Accepted
**Date**: 2026-04-23

## Context

The settings module must serve six distinct configuration domains in a single screen. Requirements:

- Each tab loads and saves independently (no shared submit)
- Tab state must survive page refresh (deep-link to a specific tab)
- Roles Management is meaningfully more complex than the other tabs (CRUD, not just key-value)
- Logo upload requires multipart form handling

## Decisions

### One hook per settings domain

`useAccountSettings`, `usePayrollSettings`, etc. — each encapsulates its own `useQuery` + `useMutation` pair.

**Rationale**: Keeps blast radius of a single tab's API failure contained. A Payroll API error does not block the Account tab from loading.

### URL param for active tab (`?tab=account`)

Active tab is read from `useSearchParams()`, not local component state.

**Rationale**: Survives page reload; enables deep links (e.g., sending a link directly to the Security tab); enables browser back/forward navigation between tabs.

### Form per tab, not a single monolithic form

Each tab mounts its own `useForm` instance. There is no shared form state between tabs.

**Rationale**: Prevents cross-tab contamination of dirty/error state. Simplifies validation — each tab's Zod schema only covers its own fields.

### `setQueryData` on mutation success (not `invalidateQueries`)

After a successful save, the mutation's `onSuccess` calls `queryClient.setQueryData` with the API response body.

**Rationale**: Avoids a redundant GET request. The backend returns the persisted record in the PATCH/POST response, so there is no need to re-fetch.

### Roles as a sub-feature within the tab

`RolesManagementTab` has its own `useRoles`, `useCreateRole`, `useUpdateRole`, `useDeleteRole` hooks and a drawer component for create/edit.

**Rationale**: Roles require list + CRUD — more complex than a simple settings form. Extracting to sub-hooks keeps `RolesManagementTab` manageable and testable.

## Consequences

- Each tab's skeleton/error state is independent — UX is more resilient to partial API failures.
- Tab switch is instant on cache hit; only shows a skeleton on cache miss or after staleTime expires.
- Logo upload uses `FormData` — the `HttpAdapter` must support `multipart/form-data` alongside JSON.
