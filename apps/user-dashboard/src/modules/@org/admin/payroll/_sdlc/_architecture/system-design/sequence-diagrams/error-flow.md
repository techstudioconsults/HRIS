# Admin Payroll — Error Flow

## Run Initiation Conflict (409 — Run Already Exists)

```
Admin    PayrollView    Backend API
  |           |              |
  |-- Run Payroll            |
  |           |-- POST /payroll/run
  |           |              |-- 409 { code: 'RUN_ALREADY_EXISTS' }
  |<-- toast: "A payroll run for this period already exists."
```

## SSE Connection Drop

```
usePayrollSSE    EventSource    Backend
     |                |             |
     |-- open() -----> |             |
     |                |  connection drops
     |                |<-- onerror  |
     |-- reconnect after 3s ------> |
     |                |  re-established
     |<-- continue receiving events
```

## Approve: Insufficient Wallet Balance (402)

```
Admin    ApproveRunDialog    Backend API
  |             |                  |
  |-- Confirm   |                  |
  |             |-- POST /payroll/run/:id/approve
  |             |                  |-- 402 { code: 'INSUFFICIENT_BALANCE', required: 5000000, available: 2000000 }
  |<-- blocking error: "Insufficient balance. You need ₦5,000,000 but your wallet has ₦2,000,000."
  |<-- "Fund Wallet" shortcut link shown
```

## Adjustment Validation Error

```
Admin    BonusDeductionDrawer    Backend API
  |              |                    |
  |-- Submit (negative amount)        |
  |              |-- Zod rejects client-side
  |<-- inline error: "Amount must be greater than zero."
  |-- Submit (valid)                  |
  |              |-- POST /payroll/run/:id/adjustments
  |              |                    |-- 422 { field: 'amount', code: 'EXCEEDS_GROSS' }
  |<-- inline error: "Deduction cannot exceed employee gross pay."
```

## Setup Wizard API Error

```
Admin    PayrollSetupWizard    Backend API
  |              |                  |
  |-- Submit Step 3 (confirm)        |
  |              |-- POST /payroll/setup
  |              |                  |-- 500
  |<-- toast: "Setup failed. Please try again."
  |<-- wizard stays on Step 3; values retained
```
