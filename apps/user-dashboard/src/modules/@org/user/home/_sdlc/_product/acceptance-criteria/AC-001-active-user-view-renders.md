# AC-001: Active-User View Renders Correctly

_Acceptance criteria for the employee home dashboard active-user view._

## Preconditions

- The employee is authenticated and their session is valid.
- `userSetupComplete` is `true` (all four setup tasks are completed).

## Criteria

| #   | Given                                         | When                               | Then                                                                                         |
| --- | --------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Employee is logged in with a complete profile | They navigate to `/user/dashboard` | The active-user view renders; the onboarding view is NOT shown                               |
| 2   | Active-user view is rendered                  | Page loads                         | Employee's first name appears in the welcome header                                          |
| 3   | Active-user view is rendered                  | Page loads                         | Three quick-action cards are visible: "Request Leave", "View Payslip", "View Team"           |
| 4   | Employee clicks "Request Leave" card button   | Click event fires                  | Employee is navigated to `/user/leave`                                                       |
| 5   | Employee clicks "View Payslip" card button    | Click event fires                  | Employee is navigated to `/user/payslip`                                                     |
| 6   | Recent activities feed is rendered            | Page loads                         | At least the four `ActivityType` variants can be displayed with correct icons and timestamps |
| 7   | Activity feed data is unavailable             | API returns error                  | A graceful empty state is shown; no unhandled exception                                      |

## Definition of Done

- All criteria above pass in unit and integration tests.
- No TypeScript strict-mode errors.
- Accessible: all interactive elements have ARIA labels and are keyboard-navigable.
