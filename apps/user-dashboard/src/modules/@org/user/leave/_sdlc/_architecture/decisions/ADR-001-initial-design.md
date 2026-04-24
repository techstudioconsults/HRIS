# ADR-001: Leave Module Initial Design

**Date**: 2026-04-23
**Status**: Accepted

## Context

The employee leave module requires a form, a history list, and multiple modal dialogs. Managing which modal is open — and the associated selected request — requires a clear, testable state strategy at the view level.

## Options Considered

1. **Separate route per action** — `/user/leave/new`, `/user/leave/{id}` — each action on its own page.
2. **Modal-based with `LeaveModalState` union** — a single `LeaveView` page manages all modals via a state machine.
3. **Zustand/Jotai store for modal state** — global store manages which modal is open.

## Decision

Option 2: a `LeaveModalState` union (`'request' | 'edit' | 'details' | 'submitted' | null`) managed with `useState` in `LeaveView`.

## Rationale

- Keeps the entire leave flow on a single `/user/leave` route — simpler navigation and bookmarking.
- The state machine is small enough to manage locally without a global store (avoids store bloat).
- Each modal is independently testable by passing the correct `open` prop.
- Consistent with the established pattern in the codebase for feature modals.

## Consequences

- `LeaveView` is the single source of truth for modal state — no sibling component can open a modal directly.
- Adding a new modal requires adding a new `LeaveModalState` variant and a corresponding transition.
- The view file may grow if many more modals are added; at that point, refactor modal state into a custom hook.
