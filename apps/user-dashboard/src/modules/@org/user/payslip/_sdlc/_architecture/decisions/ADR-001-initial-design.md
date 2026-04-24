---
section: architecture
topic: ADR
id: ADR-001
status: accepted
---

# ADR-001 — Read-Only, No Zustand, Shared PayslipStatus

## Context

The user-facing payslip module is entirely read-only. Choosing how much state infrastructure to introduce was a key decision.

## Decision

1. **No Zustand store**: The only mutable UI state is which payslip is selected for the modal. A single `useState` is sufficient and appropriate — Zustand would add complexity without benefit.

2. **Shared `PayslipStatus` from `admin/payroll`**: Rather than redefining the status enum, we import it from `admin/payroll/types`. This ensures both modules agree on valid status values.

3. **Separate `UserPayslip` type**: The admin module's `Payslip` type (in `admin/payroll/types`) is designed for the admin view (has `runId`, `employeeId` etc.). The user-facing `UserPayslip` type is tailored for the employee self-service view (`monthLabel`, `earnings[]`, `deductions[]`). Both coexist because their shapes serve different consumers.

## Consequences

- **Pro**: Minimal complexity — no store setup, no store cleanup, no persist risk.
- **Pro**: `PayslipStatus` stays in sync with admin payroll automatically.
- **Con**: If `admin/payroll/types` changes the `PayslipStatus` enum, this module's rendering must be updated too. Acceptable given admin payroll owns the lifecycle.
