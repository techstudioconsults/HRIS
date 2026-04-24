# AC-001 — Payroll Run Review

## Scenario 1: Initiate run

- **Given** no active run exists for the current period
- **When** admin clicks "Run Payroll"
- **Then** a new run is created with status `processing`; the run summary card appears with a progress indicator

## Scenario 2: SSE progress

- **Given** a run is in `processing` status
- **When** the SSE stream emits progress events
- **Then** the progress counter ("Processing 45 / 200 employees") updates in the UI without a page reload

## Scenario 3: Run complete

- **Given** the SSE stream emits a `completed` event
- **When** the UI receives it
- **Then** the progress indicator is replaced with total gross pay, deductions, and net pay; the "Approve Run" button becomes enabled

## Scenario 4: Approve and pay

- **Given** run status is `completed`
- **When** admin clicks "Approve Run" and confirms
- **Then** `POST /payroll/run/:id/approve` is called; on success, run transitions to `approved` then `paid` after wallet debit

## Scenario 5: Insufficient wallet balance

- **Given** wallet balance is less than total net pay
- **When** admin approves
- **Then** a blocking error is shown: "Insufficient wallet balance. Please top up before approving."

## Scenario 6: Add bonus

- **Given** run is in `completed` status (not yet approved)
- **When** admin adds a bonus to an employee
- **Then** that employee's gross and net update in the roster; run totals recalculate

## Non-functional

- Run summary must render within 2 seconds of run completion
- SSE stream must reconnect automatically within 3 seconds on connection drop
