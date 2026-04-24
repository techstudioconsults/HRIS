---
section: product
topic: acceptance-criteria
id: AC-001
---

# AC-001 — Payslip View Acceptance Criteria

## Scenario 1: Page load — payslips exist

**Given** I am authenticated as an employee with payslips
**When** I navigate to `/user/payslip`
**Then** the summary card shows my most recent net pay
**And** the grid shows all my payslips, most recent at the top

## Scenario 2: View payslip details

**Given** I am on the payslip page with payslips loaded
**When** I click "View" on a payslip card
**Then** the details modal opens
**And** I see the month label, gross pay, all earnings line items, all deductions line items, and net pay

## Scenario 3: Download payslip

**Given** the details modal is open
**When** I click "Download"
**Then** a file download begins with a `.pdf` extension
**And** the filename includes the month label

## Scenario 4: Empty state

**Given** I am a new employee with no payslips generated yet
**When** I navigate to `/user/payslip`
**Then** I see an empty state message "No payslips yet"
**And** the summary card is not rendered (or shows ₦0)

## Scenario 5: Loading state

**Given** the payslip API has not yet responded
**Then** skeleton cards are shown in place of the grid
**And** the summary card shows a skeleton

## Scenario 6: Data is JWT-scoped

**Given** I am authenticated as employee A
**When** I attempt to access `/payslips/:id` for employee B's payslip
**Then** the backend returns `403` and the modal does not open
