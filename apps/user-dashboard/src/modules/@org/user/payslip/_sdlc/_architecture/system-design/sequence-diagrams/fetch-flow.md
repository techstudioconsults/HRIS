---
section: architecture
topic: sequence-diagram-fetch-flow
---

# User Payslip — Fetch Flow (Sequence Diagram)

## Payslip List Fetch

```
Browser         PayslipPage      TanStack Query    UserPayslipService    Backend API
   |                |                  |                   |                  |
   |-- navigate ───▶|                  |                   |                  |
   |                |-- useQuery ─────▶|                   |                  |
   |                |                  |-- fetchFn() ─────▶|                  |
   |                |                  |                   |-- GET /payslips ─▶|
   |                |                  |                   |                  |-- validate JWT
   |                |                  |                   |                  |-- scope to employeeId
   |                |                  |                   |◀── 200 {data[]} ─|
   |                |                  |◀── PayslipList ───|                  |
   |                |◀── isSuccess ────|                   |                  |
   |                |-- render ────────────────────────────────────────────────|
   |◀── skeleton → grid + summary card |                   |                  |
```

## Payslip Detail Fetch (Modal Open)

```
Browser         PayslipPage      PayslipDetailsModal   TanStack Query   Backend API
   |                |                   |                    |                |
   |-- click View ─▶|                   |                    |                |
   |                |-- setSelectedId ─▶|                    |                |
   |                |                   |-- useQuery id ────▶|                |
   |                |                   |                    |-- GET /payslips/:id ─▶|
   |                |                   |                    |◀── 200 detail ─|
   |                |                   |◀── isSuccess ──────|                |
   |                |                   |-- render breakdown |                |
   |◀── modal open with detail ─────────|                    |                |
```
