---
section: overview
topic: scope
---

# User Payslip — Scope

## In Scope

- View a paginated grid of the authenticated employee's payslips.
- Open a detailed payslip modal showing earnings breakdown, deductions breakdown, and net pay.
- Download a payslip as PDF.
- View the latest net pay on a summary card.

## Out of Scope

- Admin payslip management (that belongs to `admin/payroll`).
- Editing or disputing a payslip (not supported — payroll is admin-finalised).
- Payslips for other employees (data is JWT-scoped on the backend).
- Creating or approving payroll runs.

## Constraints

- Read-only module — zero mutations.
- Employees can only see payslips generated for their own `employeeId` (enforced by backend JWT).
- Download generates a PDF client-side or fetches a pre-signed URL — no payslip data is permanently cached.
