# Leave Management — System Design Overview

_High-level architecture of the admin leave management frontend module._

## Module Boundaries

The `@org/admin/leave` module is a self-contained frontend feature slice. Its public API is its `index.ts` barrel. No other module imports from internal paths inside this module.

```
@org/admin/leave/
├── _views/           # Page-level components mounted by Next.js app router
├── components/       # Feature-specific UI (LeaveRequestTable, LeaveTypeCard, SetupWizard)
├── hooks/            # TanStack Query hooks (useLeaveRequests, useLeaveTypes, useLeavePolicy)
├── services/         # HttpAdapter calls (leaveService.ts)
├── store/            # Zustand stores (useLeaveFilterStore, useLeaveWizardStore)
├── types/            # TypeScript types + Zod schemas
└── index.ts          # Barrel export
```

## Data Flow Summary

1. Next.js App Router renders the page-level Server Component at `/admin/leave`.
2. Server Component performs an initial data prefetch (leave types + pending count) for fast first paint.
3. Client Components hydrate TanStack Query cache from the prefetched data.
4. All subsequent interactions (filter changes, approvals, pagination) are handled client-side via TanStack Query mutations and queries.
5. Mutation success triggers a targeted query invalidation — not a full page reload.

## Key Integration Points

- **HttpAdapter** (`src/lib/tools/dependencies.ts`): all API calls are routed through this abstraction; never raw `fetch` in hooks.
- **TanStack Query**: query keys are registered in `src/lib/react-query/query-keys.ts` under the `leave` namespace.
- **Zustand**: two stores — `useLeaveFilterStore` (active filters, current page) and `useLeaveWizardStore` (setup wizard step, draft leave type form state).
- **Zod schemas**: defined in `types/leave.schemas.ts`, shared between form validation (React Hook Form) and runtime API response parsing.

## Technology Decisions

| Concern              | Choice                | Reason                                        |
| -------------------- | --------------------- | --------------------------------------------- |
| Server state         | TanStack Query v5     | Caching, deduplication, optimistic updates    |
| UI state             | Zustand               | Lightweight, no boilerplate, tree-shakeable   |
| Form validation      | React Hook Form + Zod | Schema-first, minimal re-renders              |
| Component primitives | shadcn/ui             | Consistent design tokens, accessible defaults |
