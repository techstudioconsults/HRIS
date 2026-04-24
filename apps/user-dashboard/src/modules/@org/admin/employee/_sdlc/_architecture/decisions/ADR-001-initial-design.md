# ADR-001 — Employee Module Initial Architecture

**Status**: Accepted
**Date**: 2026-04-23

## Context

The employee management module is the central data hub for the HRIS. It requires:

- A fast, server-filtered paginated list capable of handling 1,000+ employees
- A complex multi-section form with cross-field validation and unsaved-change detection
- Real-time optimistic updates for status changes without full page reloads
- Cross-module profile tabs that must not block each other when any one API is slow

## Decision

### Server-side search and filter

All filtering, searching, and pagination is handled server-side. The API accepts `q`, `department`, `status`, `contractType`, `page`, and `size` query params. The frontend does not fetch the full list and filter client-side.

**Rationale**: Organisations with 1,000+ employees would make client-side filtering impractical. Server-side also ensures PII is not unnecessarily loaded.

### TanStack Table for the list

We use TanStack Table for column definitions, sort headers, and row rendering. The table is a controlled component driven by TanStack Query's paginated state.

**Rationale**: Avoids re-building sort, resize, and selection primitives. Consistent with the dashboard module which already uses TanStack Table.

### Optimistic status changes

Status changes use `queryClient.setQueryData` for an immediate UI update, with `onError` rollback.

**Rationale**: Status changes are frequent and the API round-trip (~500ms) creates noticeable lag. Optimistic updates make the action feel instant.

### Parallel profile tab fetches

The three profile tab APIs (employee detail, leave history, payroll summary) are initiated simultaneously. Each tab renders its own skeleton independently.

**Rationale**: A waterfall would add 500–1000ms to profile load time. Users often navigate directly to a non-default tab; waiting for all data before showing any tab is a poor UX.

### React Hook Form + Zod for the add/edit form

Schema-first validation via Zod shared between client and server (backend also validates the same schema). Form sections are registered sub-forms under one parent `useForm`.

**Rationale**: Multi-section forms with 15+ fields and complex cross-field rules (e.g., endDate required when contractType is CONTRACT) benefit from a declarative schema approach over ad hoc validation logic.

## Consequences

- TanStack Query cache keys must be explicitly managed to avoid stale data after mutations (especially the headcount widget on the dashboard).
- The form dirty-state check (`formState.isDirty`) must gate the unsaved-changes confirmation dialog — tested explicitly.
- The Zod schema must be kept in sync between the frontend form and the backend validator.
