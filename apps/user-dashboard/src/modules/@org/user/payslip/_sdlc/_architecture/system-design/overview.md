---
section: architecture
topic: system-design-overview
---

# User Payslip — System Design Overview

## Key Design Decisions

### 1. Read-Only — No Mutations

This module has zero write operations. There is no Zustand store, no form state, and no optimistic updates. The only state is TanStack Query server state and a single React `useState` for the currently-selected payslip (controls modal open/closed).

### 2. TanStack Query for Server State

```
['user', 'payslips']          → GET /payslips (list)
['user', 'payslips', id]      → GET /payslips/:id (detail on demand)
```

The list query is fetched on mount. Detail queries are fetched on demand when the modal opens. `staleTime` uses the default (60s) — payslips do not change after they are generated.

### 3. UserPayslipService via DI

`UserPayslipService` wraps `HttpAdapter` for all API calls. Consumed via `useService()` hook.

### 4. Shared PayslipStatus Type

`PayslipStatus` is imported from `admin/payroll/types` — single source of truth for the status enum used by both the admin payroll module and the user-facing payslip view.

### 5. Component Architecture

```
PayslipPage
├── PayslipSummaryCard        (latest net pay — derived from first item in list)
├── PayslipGrid               (card list)
│   └── PayslipItemCard       (individual card — month, net pay, status, View button)
└── PayslipDetailsModal       (open when user clicks View)
    ├── PayslipBreakdown      (earnings)
    └── PayslipBreakdown      (deductions)
```

### 6. Download Strategy

PDF download is initiated via `GET /payslips/:id/download` returning a blob. The frontend creates an `<a>` element with `URL.createObjectURL(blob)` and clicks it programmatically. The blob URL is immediately revoked after the click.
