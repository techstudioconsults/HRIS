# AGENTS.md

## Scope

- This is a `pnpm` + Turborepo monorepo (`pnpm-workspace.yaml`, `turbo.json`) with apps in `apps/*` and shared packages in `packages/*`.
- Node `>=20` is required (`package.json` engines); use `pnpm` workspace scripts from repo root.
- Primary active app is `apps/user-dashboard` (Next.js 16 App Router, port `3000`); secondary app is `apps/web` (port `3002`).

## Big Picture Architecture

- UI primitives live in `packages/ui` and are consumed by both apps via `@workspace/ui` (`transpilePackages` in each app config).
- `apps/user-dashboard` uses route groups `src/app/(public)` and `src/app/(private)` with auth and RBAC enforced in `src/middleware.ts`.
- Onboarding is page-routed in App Router under `src/app/(public)/onboarding/*`; `/onboarding` redirects to `/onboarding/welcome` (see `src/modules/@org/onboarding/README.md`).
- RBAC source of truth is `src/lib/routes/routes.ts` + `src/lib/auth-types.ts`; middleware redirects by role/permission (admin vs user dashboards).
- Data access pattern in `user-dashboard`: feature services -> `HttpAdapter` -> Axios instance with token interceptors (`src/lib/http/*`).
- Service wiring uses a lightweight DI container in `src/lib/tools/dependencies.ts`; React Query hooks are generated via `createServiceHooks` in `src/lib/react-query/use-service-query.ts` (`useServiceQuery`, `useSuspenseServiceQuery`, and mutation `invalidateQueries` support).
- Feature pages should import from module barrels (for example `@/modules/@org/admin/leave`) instead of reaching into feature internals from route files.
- Real-time notifications use SSE from external NestJS backend (`src/lib/sse/use-notifications.ts`); local `/api/sse` is intentionally archived (HTTP 410).

## Critical Workflows

- Install: `pnpm install` (Node `>=20`, root `package.json`).
- Run all dev pipelines: `pnpm dev`; app-specific: `pnpm dev:user` or `pnpm dev:web`.
- Build: `pnpm build` (or `pnpm build:user`, `pnpm build:web`).
- Lint and type checks: `pnpm lint`, `pnpm typecheck`.
- Unit/integration tests across workspace: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`.
- Interactive runners are available: `pnpm test:ui` (Vitest UI) and `pnpm test:e2e:ui` (Playwright UI).
- E2E from root: `pnpm test:e2e`; Playwright config is root-level and auto-starts `user-dashboard` on `3000`.
- App-local E2E scripts call root Playwright explicitly (`pnpm --dir ../.. exec playwright ...`), so keep paths rooted at repo top.
- Formatting is centralized at root: `pnpm format`.

## Testing and Debugging Conventions

- Vitest in apps merges `@workspace/test-utils/vitest.config` and reuses `packages/test-utils/src/setup.ts`.
- Do not mix Playwright with Jest DOM setup; Playwright assertions are separate (`playwright.config.ts` header note).
- Playwright discovers E2E tests from `apps/**` with `**/*.e2e.spec.ts` (`playwright.config.ts`), so both `apps/user-dashboard/e2e/*` and `apps/web/e2e/*` are in scope.
- Default Playwright projects include desktop (`chromium`, `firefox`, `webkit`) and mobile (`Mobile Chrome`, `Mobile Safari`) profiles.
- Query parameters in tables/lists are managed with `nuqs` hooks (example: `src/lib/nuqs/use-teams-search-parameters.ts`).
- `ReactQueryProvider`, `SessionProvider`, `SSEProvider`, `NuqsAdapter`, `KBarProviderWrapper`, and theme providers are composed in `src/app/layout.tsx`; add app-wide providers there.

## Project-Specific Guardrails

- Keep imports using `@` alias for app-local modules (`vitest.config.ts` alias) and `@workspace/*` for shared packages.
- Follow service+hook pattern for new API domains: create `services/.../service.ts`, register in `dependencies.ts`, expose hooks with `createServiceHooks`.
- Avoid direct `fetch` for backend API access in features; use `HttpAdapter`-backed services.
- Do not instantiate feature services directly in app code; wire service instances in `src/lib/tools/dependencies.ts`.
- Respect lint policy: `no-console` is an error in shared Next ESLint config (`packages/eslint-config/next.js`); existing exceptions are explicit.
- Commit messages must follow conventional commit types configured in `commitlint.config.js`.
- Pre-commit linting/formatting is path-scoped via `.lintstagedrc.json` (app/package filters); avoid moving files without updating scopes.

## Integration Points and Required Env

- Turbo declares global env keys: `AUTH_SECRET`, `BACKEND_URL`, `NODE_ENV` (`turbo.json`).
- `user-dashboard` auth/token flows require `AUTH_SECRET` + `NEXT_PUBLIC_BASE_URL` (`src/lib/next-auth/auth.ts`, `src/lib/http/httpConfig.ts`).
- SSE client uses `NEXT_PUBLIC_SSE_PROGRESS_CHANNEL` in code and `NEXT_PUBLIC_SSE_URL` in docs (`src/lib/sse/*`); verify actual deployed variable names before changes.
- `useNotifications` builds the stream URL as `${NEXT_PUBLIC_SSE_PROGRESS_CHANNEL}/notifications/users/{userId}` and adds auth headers in the EventSource fetch override (`src/lib/sse/use-notifications.ts`).
- Server-side CORS bypass proxy is `src/app/api/proxy/[...path]/route.ts` and requires `BACKEND_URL`.
- Playwright base URL defaults to `http://localhost:3000` and can be overridden with `PLAYWRIGHT_TEST_BASE_URL` (`playwright.config.ts`).
