# Admin Dashboard — System Design Overview

_High-level architecture of the admin dashboard frontend module._

## Module Boundaries

The dashboard module is a read-only aggregation surface. It consumes data from multiple backend domains (employees, leave, payroll, organisation) but owns no domain data itself. All mutations are delegated to their respective feature modules via navigation.

## Technology Choices

| Concern       | Choice                                                                                       | Rationale                                                                    |
| ------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Data fetching | TanStack Query (server state)                                                                | Cache management, stale-while-revalidate, background refetch on window focus |
| Rendering     | Next.js Server Components (RSC) for initial shell; Client Components for interactive widgets | Faster FCP; interactive widgets need client-side cache                       |
| Styling       | Tailwind CSS + shadcn/ui Card primitives                                                     | Consistent with monorepo design system                                       |
| State         | No global client state required                                                              | Dashboard is read-only; TanStack Query covers all async state                |

## Key Design Decisions

1. **No global state store** — Each widget fetches its own data slice independently. This prevents a single slow API from blocking the entire dashboard render.
2. **Parallel data fetching** — Widgets are co-located with their own `useQuery` calls so requests fire in parallel, not sequentially.
3. **Onboarding state from session** — Onboarding progress is derived from the auth session context already loaded at app shell level; no extra API call needed.

## Request Flow Summary

Browser → Next.js App Shell (RSC) → Client Component widgets mount → parallel `useQuery` calls → `/api/v1/dashboard/*` endpoints → cached responses rendered.

See `data-flow.md` and `sequence-diagrams/` for detailed flows.
