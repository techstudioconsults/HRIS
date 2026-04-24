# Admin Employee Module — Test Plan

## Testing Strategy

| Layer         | Tool                           | Scope                                                               |
| ------------- | ------------------------------ | ------------------------------------------------------------------- |
| Unit          | Vitest + React Testing Library | Individual components, hooks, form validation, state machine        |
| Integration   | Vitest + MSW                   | Full user flows with mocked API — list, create, edit, status change |
| E2E           | Playwright                     | Critical paths against a running app with seeded data               |
| Accessibility | axe-core + Playwright          | Automated a11y audit on all major screens                           |

---

## Unit Test Coverage Targets

| Component / Hook           | Tests                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `EmployeeFormSchema` (Zod) | Valid data passes; each required field fails independently; cross-field rule (endDate required for CONTRACT) |
| `StatusChangeSchema`       | Valid transitions pass; invalid transition rejected                                                          |
| `EmployeeStatusBadge`      | Renders correct label and colour class for each status                                                       |
| `EmployeeRowActionMenu`    | Shows correct actions; delete hidden for HR_MANAGER                                                          |
| `EmployeeTablePagination`  | Correct page count; previous disabled on page 1; next disabled on last page                                  |
| `useEmployeeList` hook     | Returns data; handles loading; handles error; re-fetches on filter change                                    |
| `EmployeeFilterPanel`      | Selecting a filter updates URL query param                                                                   |

---

## Integration Test Coverage Targets

| Flow            | Scenario                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Employee list   | Loads and renders mock data; search filters results; department filter works; pagination advances |
| Create employee | Form submits successfully; duplicate email shows field error; validation errors shown inline      |
| Edit employee   | Pre-fills form with existing data; submits update; unsaved changes dialog fires on navigate away  |
| Status change   | Optimistic badge updates immediately; API error rolls back badge and shows toast                  |
| Document upload | Progress shown; success adds doc to list; file-too-large error shown under button                 |
| Audit trail     | Renders entries for an employee; empty state when no entries                                      |

---

## E2E Critical Paths

| Path            | Steps                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------- |
| List → Profile  | Land on `/admin/employee`; search for "Amara"; click row; profile page opens with correct data |
| Create Employee | Click "Add Employee"; fill form; submit; redirected to new profile                             |
| Status Change   | Open profile; click Change Status; select Terminate; confirm; badge shows TERMINATED           |

---

## Excluded from Automated Tests

- Figma pixel-accuracy (manual design review)
- Document virus-scan integration (backend concern)
- CSV bulk import (out of scope for MVP)
