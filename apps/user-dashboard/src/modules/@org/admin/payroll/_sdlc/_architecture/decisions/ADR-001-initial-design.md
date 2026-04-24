# ADR-001 — Payroll Module Initial Architecture

**Status**: Accepted
**Date**: 2026-04-23

## Context

The payroll module has two concerns that differ from other admin modules:

1. **Real-time progress** — a payroll run can process hundreds of employees; polling is wasteful; SSE is the right primitive.
2. **Complex multi-step state** — the setup wizard, run approval, and adjustment flows require state that outlives individual components.

## Decisions

### SSE via native `EventSource` + Zustand bridge

`usePayrollSSE(runId)` opens a native `EventSource`. Events are written into a Zustand `payrollRunStore` slice instead of React state, because `EventSource` handlers operate outside the React lifecycle and setState in event callbacks risks stale closures.

**Rationale**: Zustand's store is accessible outside React without closure issues. Components subscribe via `usePayrollRunStore()` and re-render only when relevant slice keys change.

### Zustand for run orchestration state

The active run ID, SSE connection status, and progress counters live in Zustand rather than TanStack Query or React state.

**Rationale**: This state is mutated by SSE events (not API responses), spans multiple components simultaneously, and must survive component unmount/remount during SSE operation.

### TanStack Query `staleTime: 0` for run and roster

Run status and roster values change during SSE processing, so they must always re-fetch on focus/reconnect.

**Rationale**: Prevents serving stale totals after a run completes.

### Backend owns calculation; frontend displays only

The frontend never computes gross pay, deductions, or net pay. It only renders what the API returns.

**Rationale**: Calculation logic changes frequently (new deduction rules, PAYE bands). Centralising it on the backend avoids frontend/backend calculation drift.

### Approval requires confirmation dialog

`ApproveRunDialog` is an `AlertDialog` (destructive confirm) — not a simple button click.

**Rationale**: Approving a run triggers irreversible wallet debit. The confirm step prevents misclicks.

## Consequences

- SSE reconnect logic must be implemented in `usePayrollSSE` — not handled automatically by `EventSource`.
- The Zustand store must be reset when navigating away from the payroll page to prevent stale progress data.
- Any new real-time feature should extend `payrollRunStore` rather than creating a new store.
