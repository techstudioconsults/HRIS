# User Home — Test Plan

_Testing strategy for the employee home dashboard module._

## Scope

- Unit tests: component rendering for `QuickActionCard`, `ActivityItem`, `OnboardingHeader`, and view-switching logic in `HomePage`.
- Integration tests: full page render with mocked session and activity API.
- E2E tests: Playwright flow covering the dashboard load, quick-action navigation, and onboarding checklist display.
- Accessibility: automated axe-core audit on both view variants.

## Test Files

| Type        | File                                              |
| ----------- | ------------------------------------------------- |
| Unit        | `9_testing/unit/home.unit.test.tsx`               |
| Integration | `9_testing/integration/home.integration.test.tsx` |
| E2E         | `9_testing/e2e/home.e2e.spec.ts`                  |
| A11y        | `9_testing/accessibility/a11y-audit.md`           |

## Key Test Scenarios

### Unit

- `ActiveUserView` renders with correct employee name.
- `OnboardingView` renders all four setup tasks with correct statuses.
- `ActivityItem` renders correct icon and message for each `ActivityType`.
- `QuickActionCard` button triggers the provided `onClick` handler.
- `HomePage` renders `ActiveUserView` when `userSetupComplete` is `true`.
- `HomePage` renders `OnboardingView` when `userSetupComplete` is `false`.

### Integration

- Full page renders without error using mock session and `homeHandlers` MSW mock.
- Empty activity feed shows graceful empty state (no crash).

### E2E

- Employee can navigate to `/user/dashboard` and see the welcome message.
- Clicking "Request Leave" navigates to `/user/leave`.
- Clicking "View Payslip" navigates to `/user/payslip`.

## Coverage Target

> 80% line and branch coverage on all non-trivial logic in the home module.
