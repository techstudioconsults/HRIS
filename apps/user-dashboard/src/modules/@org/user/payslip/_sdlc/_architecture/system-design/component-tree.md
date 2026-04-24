---
section: architecture
topic: component-tree
---

# User Payslip — Component Tree

```
PayslipPage                          (route entry — server component wrapper)
├── PayslipSummaryCard               (latest net pay; derived from first item in list query)
├── PayslipGrid                      (paginated card list)
│   ├── PayslipItemCard[]            (month label, net pay, status badge, "View" button)
│   └── PayslipEmptyState            (shown when data is [])
└── PayslipDetailsModal              (open = selectedPayslipId !== null)
    ├── PayslipModalHeader           (period label, close button)
    ├── PayslipBreakdown             (variant="earnings" — earnings line items)
    ├── PayslipBreakdown             (variant="deductions" — deduction line items)
    ├── PayslipTotalsRow             (gross pay, total deductions, net pay)
    └── PayslipDownloadButton        (triggers blob download; shows spinner during fetch)
```

## Responsibility Map

| Component               | Owns                                     | Reads From                              |
| ----------------------- | ---------------------------------------- | --------------------------------------- |
| `PayslipPage`           | Route layout, query provider             | —                                       |
| `PayslipSummaryCard`    | Latest-pay display                       | List query (first item)                 |
| `PayslipGrid`           | Pagination, card layout                  | List query                              |
| `PayslipItemCard`       | Per-payslip card UI                      | Props from grid                         |
| `PayslipDetailsModal`   | Modal open/close, detail fetch           | `selectedPayslipId` state, detail query |
| `PayslipBreakdown`      | Line-item table (earnings or deductions) | Props                                   |
| `PayslipTotalsRow`      | Summary totals                           | Props                                   |
| `PayslipDownloadButton` | Blob download, URL lifecycle             | Props (payslipId)                       |

## State Ownership

```
PayslipPage
└── useState<string | null>(selectedPayslipId)   ← controls modal
    └── passed as prop to PayslipGrid → PayslipItemCard (sets it)
    └── passed as prop to PayslipDetailsModal (reads it, clears on close)
```

TanStack Query owns all server state. No Zustand store in this module.
