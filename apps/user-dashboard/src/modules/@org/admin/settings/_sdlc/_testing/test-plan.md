# Settings Module — Test Plan

## Testing Strategy

| Layer         | Tool                  | Scope                                          |
| ------------- | --------------------- | ---------------------------------------------- |
| Unit          | Vitest                | Zod schema validation for each settings domain |
| Integration   | Vitest + MSW          | Tab load, save, role CRUD with mocked API      |
| E2E           | Playwright            | Critical paths against a running app           |
| Accessibility | axe-core + Playwright | All six settings tabs                          |

---

## Unit Test Coverage Targets

| Subject                  | Tests                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `AccountSettingsSchema`  | Required name passes; empty name fails; invalid email fails; optional fields pass when absent |
| `PayrollSettingsSchema`  | Valid deductions pass; invalid currency code fails; negative deduction value fails            |
| `SecuritySettingsSchema` | Session timeout min/max boundaries; password min length boundary                              |
| `HRSettingsSchema`       | Working hours min/max; probation period bounds; carryover maxDays ≥ 0                         |
| `RoleFormSchema`         | Name required; permissions must have at least one entry                                       |

---

## Integration Test Coverage Targets

| Flow                   | Scenario                                                       |
| ---------------------- | -------------------------------------------------------------- |
| Account tab load       | Pre-populates form with mock data; skeleton shown during fetch |
| Account tab save       | Submits PATCH; success toast shown; form dirty flag clears     |
| Account tab save error | 500 response → error toast; form values preserved              |
| Logo upload size error | 3 MB file → client-side error, no API call                     |
| Payroll tab load       | Correct pay cycle and deductions pre-filled                    |
| Security tab           | 2FA toggle saves correctly                                     |
| Notifications tab      | Toggle updates specific event type without affecting others    |
| Roles list             | System roles rendered read-only; custom roles show edit/delete |
| Create custom role     | Drawer submission → role appears in list                       |
| Duplicate role name    | 409 → name field error in drawer                               |
| Delete role            | Confirm dialog → role removed from list                        |
| Role in use            | 409 ROLE_IN_USE → toast, role remains in list                  |

---

## E2E Critical Paths

| Path                    | Steps                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| Account settings update | Navigate to Settings; update org name; save; toast appears; field shows new value |
| Create custom role      | Click Roles tab; Create Role; fill name + permissions; submit; new role in list   |
| Delete custom role      | Click delete on custom role; confirm dialog; role removed                         |

---

## Excluded from Automated Tests

- Figma pixel-accuracy (manual design review)
- SSO/SAML configuration (out of scope v1)
- Concurrent admin session conflict (last-write-wins — manual verification)
