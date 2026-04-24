# ADR-001 — Admin Dashboard Initial Design

**Date**: 2026-04-23
**Status**: Accepted
**Module**: admin/dashboard

## Context

The admin dashboard needs to aggregate data from multiple backend domains (employees, leave, payroll) onto a single screen. We needed to decide the rendering strategy and how to handle parallel data loading without a waterfall.

## Options Considered

### Option A: Single aggregated endpoint (`GET /api/v1/dashboard`)

Backend returns all widget data in one response.

- Pro: One network round trip; simple frontend code.
- Con: Slowest endpoint dictates entire page load; no partial rendering possible; backend becomes a coupling point across domains.

### Option B: Per-widget parallel queries (chosen)

Each widget fetches its own data slice independently using TanStack Query.

- Pro: Partial rendering — fast widgets appear immediately; isolated error handling; backend endpoints remain domain-owned.
- Con: More network requests (mitigated by HTTP/2 multiplexing and query deduplication).

### Option C: Server Components with `Promise.all` prefetch

RSC fetches all data in parallel server-side and streams to the client.

- Pro: Best FCP; no client-side loading skeletons needed.
- Con: No client-side cache benefits; background refetch on focus requires converting to Client Components anyway; more complex hydration boundary management.

## Decision

**Option B** — per-widget parallel queries via TanStack Query in Client Components.

Rationale: The incremental rendering experience (fast widgets pop in as data arrives) is better UX than waiting for the slowest dataset. Independent error containment prevents one slow API from degrading the whole dashboard. The cache and background-refetch capabilities of TanStack Query provide ambient freshness without manual polling.

## Consequences

- Each widget must implement its own loading skeleton and error state — no shared loading gate.
- Query keys must be registered in the central `query-keys.ts` file.
- Other modules that mutate dashboard-relevant data must invalidate the appropriate dashboard query keys in their `onSuccess` handlers.
