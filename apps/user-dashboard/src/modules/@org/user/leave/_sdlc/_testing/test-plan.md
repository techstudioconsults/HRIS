# User Leave — Test Plan

## Testing Strategy

| Layer         | Tool                  | Scope                                                          |
| ------------- | --------------------- | -------------------------------------------------------------- |
| Unit          | Vitest                | `requestLeaveSchema` validation; `LeaveModalState` transitions |
| Integration   | Vitest + MSW          | Leave page load, request submission, edit, delete              |
| E2E           | Playwright            | Submit request → confirmation modal → history refresh          |
| Accessibility | axe-core + Playwright | Leave page and all modals                                      |

---

## Unit Test Coverage Targets

| Subject                       | Tests                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `requestLeaveSchema`          | All required fields reject when empty; valid data passes; end before start fails |
| `LeaveModalState` transitions | Each transition produces the correct next state                                  |
| `LeaveCard`                   | Renders pending/approved/rejected badge with correct text + colour class         |
| Status badge text             | Each status shows text label (not colour alone)                                  |

---

## Integration Test Coverage Targets

| Flow                    | Scenario                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| Leave page load         | Leave types loaded into form selector; requests rendered as cards |
| Submit request          | Valid form → 201 → confirmation modal opens; list invalidated     |
| Submit validation error | Empty form → client-side inline errors; no API call               |
| Submit API error        | 422 → field errors mapped; form stays open                        |
| Edit pending request    | Pre-fills form; PATCH succeeds → confirmation modal               |
| Edit non-pending        | 409 → toast; modal closes                                         |
| Delete pending          | 204 → request removed from list                                   |
| Leave types unavailable | API 500 → form shows error; submit disabled                       |

---

## E2E Critical Paths

| Path                     | Steps                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Submit new leave request | Click "Request Leave" → fill form → submit → confirmation modal → close → new card in list |
| View details             | Click leave card → `LeaveDetailsModal` opens with correct data                             |
| Edit and resubmit        | Open details → click Edit → modify dates → submit → confirmation                           |

---

## Excluded from Automated Tests

- Leave approval/rejection flow (admin module)
- Document virus-scan (backend concern)
- Calendar view (Phase 2 roadmap item)
