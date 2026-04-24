# Admin Dashboard — Test Plan

_Testing strategy and coverage targets for the admin dashboard module._

## Testing Pyramid

| Layer         | Tool                           | Scope                                        | Coverage Target               |
| ------------- | ------------------------------ | -------------------------------------------- | ----------------------------- |
| Unit          | Vitest + React Testing Library | Individual widgets, hooks, service functions | > 80%                         |
| Integration   | Vitest + MSW                   | Multi-component flows with mocked API        | Key happy paths + error paths |
| E2E           | Playwright                     | Full user journey through the dashboard      | Core scenarios                |
| Accessibility | axe-core / Playwright Axe      | WCAG 2.1 AA compliance                       | 100% of rendered widgets      |

## Unit Test Scope

- `HeadcountWidget` — renders correct values, loading state, error state, zero state
- `AttendanceRateWidget` — renders percentage and sparkline, handles missing trend data
- `PendingActionsWidget` — renders badge counts, links to correct routes
- `RecentActivityFeed` — renders feed items, handles empty feed
- `OnboardingBanner` — shows when setup incomplete, hidden when complete
- `PayrollSummaryWidget` — currency formatting, date formatting
- Service functions — API response transformation, error mapping

## Integration Test Scope

- Full dashboard page renders with MSW intercepting all six API endpoints
- One widget error does not prevent other widgets from rendering
- Window focus triggers background refetch on stale data

## E2E Test Scope

- Dashboard loads and all widgets display data (happy path)
- 401 response redirects to login page
- Onboarding banner is visible for a new organisation

## Accessibility Audit Scope

- All widgets pass automated axe-core scan
- Keyboard-only navigation through the full dashboard surface
- Screen reader announces live region updates (pending action count changes)

## Fixtures

Mock data and MSW handlers for tests are in `9_testing/fixtures/`. Do not use production API calls in any test.
