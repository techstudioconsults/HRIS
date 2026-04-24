# ADR-001 — Leave Module Initial Architecture Design

## Status

Accepted

## Date

2026-04-23

## Context

The admin leave management module requires a state management strategy that handles: (1) server data with caching and invalidation (leave requests list, leave types, employee balances), (2) transient UI state that should not re-fetch on every render (active filters, drawer open/close, wizard step), and (3) form state with complex validation rules tied to business logic (leave type allowance must be at least 1 day, cycle must be a valid enum value, carry-over cap cannot exceed annual allowance).

Additionally, the first-run setup wizard needs multi-step state persistence — if the admin navigates away mid-wizard, progress should be preserved for the session.

## Options Considered

### Option A: All state in TanStack Query

Use TanStack Query for both server state and UI state (via `placeholderData` and custom cache keys for UI concerns).

- Pro: single state solution.
- Con: TanStack Query is designed for async server state; using it for UI concerns is an anti-pattern that creates confusing invalidation behaviour.

### Option B: TanStack Query (server) + React `useState`/`useReducer` (UI)

Keep server state in TanStack Query and local UI state in component-level hooks.

- Pro: simple, no additional library.
- Con: filter state lives in components — sharing between `LeaveRequestFilters` and `LeaveRequestTable` requires prop-drilling or lifting state to a shared ancestor, which creates tight coupling.

### Option C: TanStack Query (server) + Zustand (UI) — Chosen

TanStack Query manages all API data. Zustand stores manage shared UI concerns that span multiple components: active filters, drawer visibility, wizard step.

- Pro: clean separation, no prop-drilling, Zustand stores are lightweight and tree-shakeable.
- Pro: wizard state survives component unmount without complex `useEffect` persistence logic.
- Con: two state libraries to understand; mitigated by clear taxonomy in `state-management.md`.

## Decision

Use **TanStack Query v5** for all server state and **Zustand** for shared UI state. React Hook Form + Zod handles form state locally within form components.

## Consequences

- All query keys must be registered in `src/lib/react-query/query-keys.ts` — no inline key arrays.
- Zustand stores are defined per concern (`useLeaveFilterStore`, `useLeaveWizardStore`, `useLeaveDrawerStore`) — one store per logical UI concern, not one global store.
- Form schemas in `types/leave.schemas.ts` are the single source of truth for both runtime validation and TypeScript types.
