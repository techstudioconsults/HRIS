---
applyTo: 'apps/user-dashboard/**'
description: 'Next.js 16 App Router standards for the HRIS user-dashboard application'
---

# Next.js 16 App Router — HRIS user-dashboard

## Framework & Routing

- This app uses **Next.js 16 App Router** (`src/app/`). Never use Pages Router patterns (`getServerSideProps`, `getStaticProps`, `_app.tsx`).
- Route groups: `(public)` for unauthenticated pages, `(private)/(org)/admin` for admin, `(private)/(org)/user` for employees.
- Page files are `page.tsx`. Layout files are `layout.tsx`. Loading states use `loading.tsx`. Error boundaries use `error.tsx`.
- Server Components are the default. Add `"use client"` only when the component needs browser APIs, React state, or event handlers.

## Import Aliases

- Always use `@/` for app-local imports (`apps/user-dashboard/src/`).
- Always use `@workspace/ui` for shared primitives from `packages/ui`.
- Never use deep relative paths (`../../`) when `@/` resolves the same file.

## Data Fetching — CRITICAL

**Never** call `fetch()` directly. **Never** instantiate services with `new`. All data access must go through the DI → HttpAdapter chain:

```
Component → useXxxService() → createServiceHooks → DI container → XxxService → HttpAdapter → Axios
```

- Service classes live in `src/modules/@org/<role>/<feature>/services/service.ts`.
- React Query hooks live in `src/modules/@org/<role>/<feature>/services/use-service.ts`.
- Services are registered once in `src/lib/tools/dependencies.ts`.
- Hooks are created with `createServiceHooks<TService>(dependencies.XXX_SERVICE)` from `@/lib/react-query/use-service-query`.

## React Query

Use the three hooks from `createServiceHooks`:

- `useServiceQuery(key, fn, opts?)` — standard query.
- `useSuspenseServiceQuery(key, fn, opts?)` — for Suspense boundaries.
- `useServiceMutation(fn, { invalidateQueries })` — for writes; `invalidateQueries` returns the key arrays to bust.

All query keys are centralized in `src/lib/react-query/query-keys.ts`. Add new keys there — never inline them.

## Module / Feature Structure

Every feature under `src/modules/@org/<role>/<feature>/` must follow:

```
_components/   ← private UI, never imported from outside
_views/        ← page-level assembled views
config/        ← column defs, static config
constants/     ← feature-scoped constants
services/
  service.ts       ← HttpAdapter calls
  use-service.ts   ← createServiceHooks hooks
stores/        ← Zustand for local UI state
types/         ← TypeScript interfaces
index.ts       ← barrel export (only public API)
```

Route `page.tsx` files **only import from `index.ts`**, never from internal folders.

## Auth & RBAC

- Auth is NextAuth v5 (`src/lib/next-auth/auth.ts`). Never implement custom session logic.
- Permissions are strings from `MODULE_PERMISSIONS` in `src/lib/auth-types.ts` (e.g. `"admin"`, `"leave:read"`).
- Route protection is declared in `src/lib/routes/routes.ts` via `ROUTE_CONFIGS` — add entries there, never guard routes inline.
- Users with `admin` permission → `/admin/*`. Users without → `/user/*`. The proxy handles the redirect automatically.

## URL State (Tables & Filters)

Use `nuqs` for all query-parameter state (search, page, filters, sort). Reference: `src/lib/nuqs/use-teams-search-parameters.ts`.

```ts
'use client';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
```

Never use `useState` + `router.push` for URL-reflected state.

## UI Components

- Primitives (`Button`, `Dialog`, `Table`, etc.) come from `@workspace/ui` — never re-implement them.
- App-wide composed components live in `src/components/`.
- Feature-specific components stay in `src/modules/@org/<role>/<feature>/_components/`.
- Theme CSS is imported via `@workspace/ui/themes.css` in `globals.css`.

## App-Wide Providers

The provider order in `src/app/layout.tsx` is fixed — **do not change it**:

```
SessionProvider → SSEProvider → ReactQueryProvider → NuqsAdapter
  → TooltipProvider → ThemeProvider → KBarProviderWrapper → {children}
```

Add new global providers inside `layout.tsx` only, respecting this nesting order.

## Real-Time (SSE)

- Use `useNotifications(userId, token)` from `src/lib/sse/use-notifications.ts`.
- Events are typed via `EventRegistry` (e.g. `PAYROLL_APPROVED`, `SALARY_PAID`).
- SSE connects to the **external NestJS backend**, not a local API route.
- The local `/api/sse` route is **archived and returns HTTP 410** — never reference it.

## Linting & Code Style

- `no-console` is a **lint error**. Use `eslint-disable` only as a last resort with a comment explaining why.
- TypeScript strict mode is enabled. Avoid `any` — use `unknown` or proper generics.
- Never use `new Service()` outside `src/lib/tools/dependencies.ts`.
- Never call `fetch()` directly — always use `HttpAdapter`.

## Server Components vs Client Components

| Need                                    | Directive                       |
| --------------------------------------- | ------------------------------- |
| Data fetching, no interactivity         | Server Component (no directive) |
| `useState`, `useEffect`, event handlers | `"use client"`                  |
| React Query hooks                       | `"use client"`                  |
| `nuqs` hooks                            | `"use client"`                  |
| SSE / `useNotifications`                | `"use client"`                  |

## Testing

- Unit/integration: **Vitest** + `@testing-library/react`. Config merges `@workspace/test-utils/vitest.config`.
- E2E: **Playwright** from root `playwright.config.ts`. Test files in `apps/user-dashboard/e2e/`.
- Never mix Playwright assertions with `@testing-library/jest-dom`.
- Run with `pnpm test` (Vitest) or `pnpm test:e2e` (Playwright) from repo root.

```

```
