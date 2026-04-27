---
section: product
topic: acceptance-criteria
id: AC-001
---

# AC-001 — Onboarding Acceptance Criteria

## Step 1 — Company Profile

| #   | Criterion                                   | Verified |
| --- | ------------------------------------------- | -------- |
| 1   | Form pre-fills with existing company data   | ☐        |
| 2   | All required fields validated before submit | ☐        |
| 3   | Successful save navigates to /step-2        | ☐        |
| 4   | Back-navigation to step-1 shows saved data  | ☐        |

## Step 2 — Teams & Roles

| #   | Criterion                                              | Verified |
| --- | ------------------------------------------------------ | -------- |
| 5   | Clicking "Add Team" creates a team and shows accordion | ☐        |
| 6   | Team name is editable inline                           | ☐        |
| 7   | Adding a role to a team saves with correct permissions | ☐        |
| 8   | Deleting a team without employees succeeds             | ☐        |
| 9   | Deleting a team with employees shows blocking error    | ☐        |
| 10  | "Next" button is disabled if no teams exist            | ☐        |

## Step 3 — Employee Onboarding

| #   | Criterion                                             | Verified |
| --- | ----------------------------------------------------- | -------- |
| 11  | Team and Role dropdowns populate from Step 2 data     | ☐        |
| 12  | Selecting a team filters the Role dropdown            | ☐        |
| 13  | All employee fields validated before batch submit     | ☐        |
| 14  | Successful invite navigates to /admin/dashboard       | ☐        |
| 15  | Duplicate email error shown on affected employee form | ☐        |

## Setup Status

| #   | Criterion                                                                | Verified |
| --- | ------------------------------------------------------------------------ | -------- |
| 16  | `takenTour` flag updated on dashboard first visit                        | ☐        |
| 17  | Owner revisiting /onboarding after completion is redirected to dashboard | ☐        |

## Tour

| #   | Criterion                                            | Verified |
| --- | ---------------------------------------------------- | -------- |
| 18  | Tour launches and steps through dashboard highlights | ☐        |
| 19  | Dismissing tour still proceeds to Step 1             | ☐        |
