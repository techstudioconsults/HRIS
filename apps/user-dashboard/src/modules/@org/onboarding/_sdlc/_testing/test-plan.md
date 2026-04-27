---
section: testing
topic: test-plan
---

# Onboarding — Test Plan

## Scope

| Layer         | Tool                              | Coverage Target                 |
| ------------- | --------------------------------- | ------------------------------- |
| Unit          | Vitest                            | Zod schemas, pure functions     |
| Integration   | Vitest + RTL + MSW                | Step form flows with mocked API |
| E2E           | Playwright                        | Full wizard golden path         |
| Accessibility | axe-core (`@axe-core/playwright`) | WCAG 2.1 AA per step            |

## Test Scenarios

### Unit

| ID   | Scenario                                                                           |
| ---- | ---------------------------------------------------------------------------------- |
| U-01 | `companyProfileSchema` requires name, industry, size, city, country                |
| U-02 | `onboardEmployeeSchema` requires firstName, lastName, email, phone, teamId, roleId |
| U-03 | `onboardEmployeeSchema` rejects invalid email                                      |

### Integration

| ID   | Scenario                                                    |
| ---- | ----------------------------------------------------------- |
| I-01 | Step 1 form pre-fills from GET /companies/current           |
| I-02 | Step 1 submit calls PATCH and navigates to step-2           |
| I-03 | Step 2 loads teams from API and renders accordions          |
| I-04 | Add team → new accordion appears                            |
| I-05 | Delete team (no employees) → accordion removed              |
| I-06 | Delete team with employees → toast error shown              |
| I-07 | Add role to team → role appears in accordion                |
| I-08 | Step 3 team dropdown populates from teams data              |
| I-09 | Selecting team filters role dropdown                        |
| I-10 | Batch employee invite succeeds → navigates to dashboard     |
| I-11 | Duplicate email in batch → field error on affected employee |

### E2E

| ID   | Scenario                                                  |
| ---- | --------------------------------------------------------- |
| E-01 | Full wizard golden path (step 1 → 2 → 3 → dashboard)      |
| E-02 | Back navigation preserves step 1 data                     |
| E-03 | Unauthenticated user redirected to /login                 |
| E-04 | Owner revisiting /onboarding after completion → dashboard |

### Accessibility

| ID   | Check                                          |
| ---- | ---------------------------------------------- |
| A-01 | No axe violations on each step page            |
| A-02 | Breadcrumb active step has aria-current="step" |
| A-03 | Accordion panels use correct aria-expanded     |
| A-04 | All form inputs have associated labels         |
