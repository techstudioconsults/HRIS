# Leave Management — Test Plan

_Testing strategy for the admin leave management module covering unit, integration, E2E, and accessibility._

## Scope

All components, hooks, services, and stores within `@org/admin/leave` are in scope. The backend API is mocked via MSW in unit and integration tests.

## Test Levels

### Unit Tests (`9_testing/unit/`)

- Target: individual hooks (`useLeaveRequests`, `useApproveLeaveRequest`), Zustand store actions, Zod schema validation, and pure utility functions (leave day calculation).
- Tool: Vitest + React Testing Library
- Coverage target: > 80% of domain logic and hook branches.

### Integration Tests (`9_testing/integration/`)

- Target: full component trees with MSW mocking the API layer. Tests simulate real user interactions (click filter, see updated table; click approve, see status change).
- Tool: Vitest + React Testing Library + MSW v2
- Key scenarios: happy path approval, decline with reason, empty state, error state with retry.

### E2E Tests (`9_testing/e2e/`)

- Target: full browser flows against the running app (Playwright).
- Key scenarios: navigate to leave page, run setup wizard for new org, approve a request, decline with reason, filter requests by status.
- Tool: Playwright

### Accessibility Audit (`9_testing/accessibility/`)

- Tool: axe-core via `@axe-core/playwright` during E2E runs.
- Targets: Leave dashboard, detail drawer, leave type form, setup wizard.

## Test Data Strategy

- All mock data is centralised in `9_testing/fixtures/mock-data.ts`.
- MSW handlers for tests are in `9_testing/fixtures/handlers.ts` (may differ from `4_api/mocks/` for error scenario testing).

## Prioritised Test Scenarios

| Priority | Scenario                                     | Test Level        |
| -------- | -------------------------------------------- | ----------------- |
| P0       | Approve leave request — happy path           | Integration + E2E |
| P0       | Decline leave request with reason            | Integration + E2E |
| P0       | Setup wizard completes and dismisses         | Integration + E2E |
| P1       | Filter requests by status                    | Integration       |
| P1       | Create new leave type                        | Integration       |
| P1       | Leave balance displayed correctly in drawer  | Integration       |
| P2       | Error state shown when API returns 500       | Integration       |
| P2       | Retry button re-fetches data                 | Integration       |
| P3       | Keyboard navigation through table and drawer | E2E + a11y        |
| P3       | Screen reader announces status badge         | a11y              |
