---
section: testing
topic: test-plan
---

# User Payslip — Test Plan

## Scope

| Layer         | Tool                                  | Coverage Target                                   |
| ------------- | ------------------------------------- | ------------------------------------------------- |
| Unit          | Vitest                                | Domain logic, pure functions, component rendering |
| Integration   | Vitest + React Testing Library + MSW  | User flows with mocked API                        |
| E2E           | Playwright                            | Golden path + key error cases                     |
| Accessibility | axe-core (via `@axe-core/playwright`) | WCAG 2.1 AA                                       |

## Test Scenarios by Layer

### Unit Tests

| ID   | Scenario                                                                      | File                    |
| ---- | ----------------------------------------------------------------------------- | ----------------------- |
| U-01 | `PayslipSummaryCard` renders `netPay` from props                              | `payslip.unit.test.tsx` |
| U-02 | `PayslipItemCard` renders month label, net pay, status badge, and View button | `payslip.unit.test.tsx` |
| U-03 | `PayslipBreakdown` renders all line items with correct labels and amounts     | `payslip.unit.test.tsx` |
| U-04 | `PayslipTotalsRow` renders gross, deductions, net correctly                   | `payslip.unit.test.tsx` |
| U-05 | `PayslipEmptyState` renders when no payslips                                  | `payslip.unit.test.tsx` |

### Integration Tests

| ID   | Scenario                                            | File                           |
| ---- | --------------------------------------------------- | ------------------------------ |
| I-01 | Page loads and renders payslip list from MSW        | `payslip.integration.test.tsx` |
| I-02 | Summary card shows `netPay` of first item           | `payslip.integration.test.tsx` |
| I-03 | Clicking "View" opens modal with detail             | `payslip.integration.test.tsx` |
| I-04 | Modal shows correct earnings and deductions         | `payslip.integration.test.tsx` |
| I-05 | Pressing Escape closes modal                        | `payslip.integration.test.tsx` |
| I-06 | 404 on detail fetch shows toast, modal stays closed | `payslip.integration.test.tsx` |
| I-07 | Empty list renders empty state                      | `payslip.integration.test.tsx` |
| I-08 | Download button initiates download (blob created)   | `payslip.integration.test.tsx` |

### E2E Tests

| ID   | Scenario                                               | File                  |
| ---- | ------------------------------------------------------ | --------------------- |
| E-01 | Authenticated employee sees payslip grid               | `payslip.e2e.spec.ts` |
| E-02 | Opens payslip detail modal and views breakdown         | `payslip.e2e.spec.ts` |
| E-03 | Downloads payslip PDF                                  | `payslip.e2e.spec.ts` |
| E-04 | Unauthenticated user is redirected to `/login`         | `payslip.e2e.spec.ts` |
| E-05 | Empty state rendered for new employee with no payslips | `payslip.e2e.spec.ts` |

### Accessibility Audit

| ID   | Check                                               | File            |
| ---- | --------------------------------------------------- | --------------- |
| A-01 | No axe violations on payslip list page              | `a11y-audit.md` |
| A-02 | Modal focus trap — Tab cycles within modal          | `a11y-audit.md` |
| A-03 | Download button announces aria-busy during download | `a11y-audit.md` |
| A-04 | Status badges readable without colour               | `a11y-audit.md` |

## Out of Scope

- Payslip creation / editing (belongs to `admin/payroll` tests)
- Token refresh flow (tested in `httpConfig` unit tests)
