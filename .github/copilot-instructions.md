# GitHub Copilot Instructions — HRIS Monorepo

## 1. Project Identity

This is **HRIS** (Human Resource Information System) built by **Techstudio Academy**.  
It is a **pnpm + Turborepo monorepo** (`pnpm-workspace.yaml`, `turbo.json`).

- Node `>=20` required. Always use `pnpm`, never `npm` or `yarn`.
- Primary app: `apps/user-dashboard` — **Next.js 16 App Router**, runs on port **3000**.
- Secondary app: `apps/web` — runs on port **3002**.
- Shared packages live in `packages/*` and are consumed via `@workspace/*` aliases.

---

## 2. Monorepo Directory Map

```
hris-repo/
├── apps/
│   ├── user-dashboard/          # Primary Next.js 16 app (port 3000)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (public)/    # Unauthenticated pages (auth, onboarding, home)
│   │       │   └── (private)/
│   │       │       └── (org)/
│   │       │           ├── admin/   # Admin dashboard routes
│   │       │           └── user/    # Employee dashboard routes
│   │       ├── components/      # Shared UI components (app-local)
│   │       ├── context/         # React contexts (e.g. SSEProvider)
│   │       ├── hooks/           # App-level custom hooks
│   │       ├── HOC/             # Higher-order components
│   │       ├── lib/             # Core utilities (auth, http, react-query, routes, sse…)
│   │       ├── modules/         # Feature modules
│   │       │   └── @org/
│   │       │       ├── admin/   # Admin features (employee, leave, payroll, teams…)
│   │       │       ├── user/    # Employee-facing features (leave, attendance…)
│   │       │       ├── auth/    # Auth module
│   │       │       ├── onboarding/
│   │       │       └── shared/  # Cross-role shared logic
│   │       ├── schemas/         # Zod validation schemas
│   │       ├── services/        # App-level services (e.g. AppService)
│   │       ├── stores/          # Zustand stores
│   │       ├── styles/
│   │       ├── types/           # Global TypeScript types
│   │       └── middleware.ts    # Auth + RBAC middleware
│   └── web/                     # Marketing/landing app (port 3002)
└── packages/
    ├── ui/                      # @workspace/ui — shared UI primitives (shadcn-based)
    ├── test-utils/              # @workspace/test-utils — Vitest config + setup
    ├── eslint-config/           # @workspace/eslint-config
    └── typescript-config/       # @workspace/typescript-config
```

---

## 3. Import Aliases — ALWAYS Use These

| Alias                   | Resolves to                |
| ----------------------- | -------------------------- |
| `@/`                    | `apps/user-dashboard/src/` |
| `@workspace/ui`         | `packages/ui/src`          |
| `@workspace/test-utils` | `packages/test-utils/src`  |

- **Never** use relative paths (`../../`) when `@/` works.
- **Never** use `@workspace/*` for app-local code.

---

## 4. Feature Module Structure

Every feature lives under `src/modules/@org/<role>/<feature>/` and follows this layout:

```
<feature>/
├── _components/     # UI components private to this feature
├── _views/          # Page-level view components (assembled from _components)
├── config/          # Static config, column definitions, etc.
├── constants/       # Feature-scoped constants
├── services/
│   ├── service.ts       # Class extending HttpAdapter calls
│   └── use-service.ts   # React Query hooks via createServiceHooks
├── stores/          # Zustand store for local UI state
├── types/           # TypeScript types/interfaces for this feature
└── index.ts         # Public barrel export
```

Route pages (`app/(private)/(org)/admin/<feature>/page.tsx`) import **only from the module's `index.ts`**.

---

## 5. Data Access Pattern (CRITICAL — Never Skip)

```
Page / Component
  └─► useXxxService() hook  (src/modules/.../services/use-service.ts)
        └─► createServiceHooks<XxxService>(dependencies.XXX_SERVICE)
              └─► DI Container  (src/lib/tools/dependencies.ts)
                    └─► XxxService instance
                          └─► HttpAdapter  (src/lib/http/http-adapter.ts)
                                └─► Axios instance  (src/lib/http/httpConfig.ts)
                                      └─► NestJS Backend API
```

### 5a. Adding a New API Domain — Checklist

1. Create `src/modules/@org/<role>/<feature>/services/service.ts`:

```ts
import { HttpAdapter } from '@/lib/http/http-adapter';

export class MyFeatureService {
  constructor(private readonly http: HttpAdapter) {}

  async getItems(filters: QueryParameters = {}) {
    const response = await this.http.get<{ data: MyItem[] }>(
      '/my-endpoint',
      filters
    );
    if (response?.status === 200) return response.data;
  }
}
```

2. Register in `src/lib/tools/dependencies.ts`:

```ts
// add symbol
MY_FEATURE_SERVICE: Symbol('MyFeatureService'),

// instantiate
const myFeatureService = new MyFeatureService(httpAdapter);

// register
container.add(dependencies.MY_FEATURE_SERVICE, myFeatureService);
```

3. Create `src/modules/@org/<role>/<feature>/services/use-service.ts`:

```ts
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';
import { queryKeys } from '@/lib/react-query/query-keys';
import { MyFeatureService } from './service';

export const useMyFeatureService = () => {
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<MyFeatureService>(dependencies.MY_FEATURE_SERVICE);

  const useGetItems = (filters = {}, options?: any) =>
    useServiceQuery(
      queryKeys.myFeature.list(filters),
      (s) => s.getItems(filters),
      options
    );

  const useCreateItem = () =>
    useServiceMutation((s, data: CreateItemPayload) => s.createItem(data), {
      invalidateQueries: () => [queryKeys.myFeature.list()],
    });

  return { useGetItems, useCreateItem };
};
```

4. Add query keys to `src/lib/react-query/query-keys.ts`:

```ts
myFeature: {
  list: (filters?: Filters) => ['myFeature', 'list', filters] as const,
  detail: (id: string) => ['myFeature', 'detail', id] as const,
},
```

5. Export from `index.ts` and consume in pages/components.

---

## 6. React Query Hooks Reference

All hooks come from `createServiceHooks<TService>(symbol)`:

| Hook                                      | Purpose                                    |
| ----------------------------------------- | ------------------------------------------ |
| `useServiceQuery(key, fn, opts?)`         | Standard async query                       |
| `useSuspenseServiceQuery(key, fn, opts?)` | Query wrapped in React Suspense            |
| `useServiceMutation(fn, opts?)`           | Mutation with optional `invalidateQueries` |

`invalidateQueries` receives `(data, variables, context)` and returns an array of query key arrays to bust after success.

---

## 7. Auth & RBAC

### Roles (`src/lib/auth-types.ts`)

```ts
ROLES = { OWNER, HR_MANAGER, WELFARE_OFFICER, EMPLOYEE };
```

### Permissions (module-scoped)

Pattern: `<module>:<action>` — e.g. `leave:read`, `payroll:manage`, `admin`.

Key: Users with `admin` permission → **admin dashboard** (`/admin/*`).  
Users without `admin` permission → **user dashboard** (`/user/*`).

### Middleware (`src/middleware.ts`)

- Reads `next-auth` JWT → extracts `role` + `permissions`.
- Redirects admins away from `/user/*` → `/admin/dashboard`.
- Redirects non-admins away from `/admin/*` → `/user/dashboard`.
- Route access is declared in `src/lib/routes/routes.ts` via `ROUTE_CONFIGS`.

### Adding a Protected Route

Add an entry to `ROUTE_CONFIGS` in `src/lib/routes/routes.ts`:

```ts
{
  path: '/admin/my-feature',
  accessLevel: ACCESS_LEVELS.OWNER_ONLY,
  requiredPermissions: [MODULE_PERMISSIONS.MY_PERMISSION],
}
```

---

## 8. App-Wide Providers (layout.tsx)

Provider nesting order in `src/app/layout.tsx` — **do not reorder**:

```
SessionProvider
  └─ SSEProvider
       └─ ReactQueryProvider
            └─ NuqsAdapter
                 └─ TooltipProvider
                      └─ ThemeProvider
                           └─ KBarProviderWrapper
                                └─ {children}
```

Add new app-wide providers inside `layout.tsx` only. Match this nesting convention.

---

## 9. URL State / Query Parameters

Use `nuqs` hooks for table/list filters (page, search, sort, status, etc.).  
Reference implementation: `src/lib/nuqs/use-teams-search-parameters.ts`.

```ts
'use client';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export const useMyFeatureSearchParameters = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger);
  const [search, setSearch] = useQueryState('search', parseAsString);
  // ...
};
```

---

## 10. Real-Time Notifications (SSE)

- Hook: `src/lib/sse/use-notifications.ts` → `useNotifications(userId, token)`
- Events are declared in `EventRegistry` (e.g. `PAYROLL_APPROVED`, `SALARY_PAID`).
- Provider: `SSEProvider` in `src/context/sse-provider.tsx`.
- SSE connects to **external NestJS backend**, not a local Next.js route.
- Env vars: `NEXT_PUBLIC_SSE_PROGRESS_CHANNEL`, `NEXT_PUBLIC_SSE_URL`.
- The local `/api/sse` route is **archived (returns HTTP 410)** — never use it.

---

## 11. Environment Variables

| Variable                           | Used in                                    |
| ---------------------------------- | ------------------------------------------ |
| `AUTH_SECRET`                      | NextAuth, middleware                       |
| `NEXT_PUBLIC_BASE_URL`             | Axios base URL, auth login                 |
| `BACKEND_URL`                      | Server-side proxy (`/api/proxy/[...path]`) |
| `NEXT_PUBLIC_SSE_PROGRESS_CHANNEL` | SSE client                                 |
| `NEXT_PUBLIC_SSE_URL`              | SSE client (docs reference)                |
| `NODE_ENV`                         | Token cookie security                      |

---

## 12. Scripts Reference

```bash
# Install (always pnpm)
pnpm install

# Dev servers
pnpm dev              # all apps
pnpm dev:user         # user-dashboard only (port 3000)
pnpm dev:web          # web only (port 3002)

# Build
pnpm build            # all
pnpm build:user       # user-dashboard only

# Quality
pnpm lint
pnpm typecheck

# Tests
pnpm test             # unit + integration (Vitest)
pnpm test:watch
pnpm test:coverage
pnpm test:e2e         # Playwright (auto-starts user-dashboard on 3000)
```

---

## 13. Testing Conventions

### Unit / Integration (Vitest)

- Config: `apps/user-dashboard/vitest.config.ts` merges `@workspace/test-utils/vitest.config`.
- Setup file: `packages/test-utils/src/setup.ts`.
- `@` alias resolves to `apps/user-dashboard/src/`.
- Exclude `**/e2e/**` from Vitest runs.
- **Do not** mix Playwright matchers with `@testing-library/jest-dom`.

### E2E (Playwright)

- Config: root `playwright.config.ts`. Base URL: `http://localhost:3000` (override with `PLAYWRIGHT_TEST_BASE_URL`).
- Auto-starts `user-dashboard` dev server.
- E2E test files live in `apps/user-dashboard/e2e/`.
- App-local E2E scripts call root Playwright: `pnpm --dir ../.. exec playwright ...`.

---

## 14. Code Style & Lint Rules

- **`no-console` is a lint error** in shared ESLint config (`packages/eslint-config/next.js`). Use explicit `eslint-disable` comments only where absolutely needed.
- TypeScript strict mode is on. Avoid `any` — use `unknown` or proper generics.
- No direct `fetch` calls — always go through `HttpAdapter`.
- No manual `new Service()` outside `src/lib/tools/dependencies.ts`.
- Commit messages **must** follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, etc.) — enforced by `commitlint`.
- Pre-commit hooks run lint + format scoped to changed files (`.lintstagedrc.json`).

---

## 15. UI Components

- Primitive components come from `@workspace/ui` (shadcn/ui-based, Radix primitives).
- App-specific composed components live in `src/components/`.
- Feature-specific components stay in `src/modules/@org/<role>/<feature>/_components/`.
- `@workspace/ui` is transpiled by Next.js (`transpilePackages: ['@workspace/ui']` in `next.config.ts`).
- Theme CSS: imported as `@workspace/ui/themes.css` in `src/app/globals.css`.

---

## 16. Onboarding Flow

- Route: `/onboarding` → redirects to `/onboarding/welcome`.
- Steps: `welcome → step-1 → step-2 → step-3`.
- Module: `src/modules/@org/onboarding/`.
- Service registered as `dependencies.ONBOARDING_SERVICE`.
- This is a **public** route — no auth required.

---

## 17. Key Files Quick Reference

| Purpose                        | File                                       |
| ------------------------------ | ------------------------------------------ |
| DI container & service wiring  | `src/lib/tools/dependencies.ts`            |
| React Query hook factory       | `src/lib/react-query/use-service-query.ts` |
| Centralized query keys         | `src/lib/react-query/query-keys.ts`        |
| Axios instance + interceptors  | `src/lib/http/httpConfig.ts`               |
| HTTP adapter (get/post/patch…) | `src/lib/http/http-adapter.ts`             |
| Auth config (NextAuth v5)      | `src/lib/next-auth/auth.ts`                |
| RBAC types & permissions       | `src/lib/auth-types.ts`                    |
| Route access control map       | `src/lib/routes/routes.ts`                 |
| Auth + RBAC middleware         | `src/middleware.ts`                        |
| SSE notifications hook         | `src/lib/sse/use-notifications.ts`         |
| App-wide providers             | `src/app/layout.tsx`                       |
| Proxy to backend (server-side) | `src/app/api/proxy/[...path]/route.ts`     |
