---
section: domain
topic: entities
---

# User Payslip — Domain Entities

## Payslip

The core read model exposed to the employee.

```typescript
interface Payslip {
  id: string; // UUID
  employeeId: string; // JWT-inferred; echoed by API
  period: string; // "YYYY-MM" — e.g. "2025-06"
  periodLabel: string; // Human label — e.g. "June 2025"
  grossPay: number; // Sum of earnings, before deductions
  totalDeductions: number; // Sum of all deduction lines
  netPay: number; // grossPay - totalDeductions
  status: PayslipStatus; // "FINALIZED" | "DRAFT" (employee sees FINALIZED only)
  earnings: PayslipLine[]; // Itemized earnings
  deductions: PayslipLine[]; // Itemized deductions
  generatedAt: string; // ISO 8601
  pdfUrl?: string; // Optional pre-signed URL; may be null (use download endpoint instead)
}
```

## PayslipLine

Represents one line item inside a payslip (an earning or a deduction).

```typescript
interface PayslipLine {
  id: string;
  label: string; // e.g. "Basic Salary", "PAYE Tax", "Pension"
  amount: number; // Always positive; sign implied by parent array (earnings vs deductions)
  description?: string; // Optional explanatory note
}
```

## PayslipStatus (shared enum)

```typescript
type PayslipStatus = 'DRAFT' | 'FINALIZED';
```

Owned by `admin/payroll/types`. Employees only ever receive `FINALIZED` payslips from the API (the backend filters by status).

## PayslipListItem

Lightweight projection used by the list endpoint to avoid sending full line items in the list response.

```typescript
interface PayslipListItem {
  id: string;
  period: string;
  periodLabel: string;
  netPay: number;
  status: PayslipStatus;
  generatedAt: string;
}
```

## Invariants

- `netPay === grossPay - totalDeductions` — enforced by the backend; the frontend displays but never recalculates.
- A `Payslip` with `status !== 'FINALIZED'` is never returned to the employee-facing API.
- `earnings` and `deductions` are only present in the detail response (`GET /payslips/:id`), not the list.
