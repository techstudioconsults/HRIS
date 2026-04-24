---
section: domain
topic: bounded-context
---

# User Payslip — Bounded Context

## Context Name

**EmployeePayslipView**

## Responsibility

Provides read-only access to an authenticated employee's finalized payslips, including itemized earnings and deductions, and PDF export.

## Context Boundary

```
┌─────────────────────────────────────────────────────┐
│  EmployeePayslipView                                │
│                                                     │
│  Aggregates: Payslip, PayslipLine                   │
│  Services:   UserPayslipService                     │
│  Queries:    list (paginated), getById, downloadPdf │
│  Mutations:  NONE                                   │
└─────────────────────────────────────────────────────┘
         ▲ reads from
┌─────────────────────────────────────────────────────┐
│  PayrollManagement (admin/payroll)                  │
│  Owns: PayrollRun, Payslip creation, finalization   │
│  Provides: finalized Payslip records via API        │
└─────────────────────────────────────────────────────┘
```

## Upstream Dependencies

| Context         | What We Consume                                         |
| --------------- | ------------------------------------------------------- |
| `admin/payroll` | Finalized `Payslip` records (read via `GET /payslips`)  |
| `AuthSession`   | JWT bearer token for employee identity and data scoping |

## Shared Types

| Type            | Owned By              | Imported In          |
| --------------- | --------------------- | -------------------- |
| `PayslipStatus` | `admin/payroll/types` | `user/payslip/types` |

## Anti-Corruption Notes

- This context never calls payroll write endpoints.
- `PayslipStatus` is a shared enum — this context reads it but never mutates it.
- Employee identity is never passed explicitly from the client; the backend resolves it from the JWT.
