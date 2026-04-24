# Leave Management — Component Tree

_Visual hierarchy of all React components within the admin leave module._

## Page Entry Point

```
LeaveAdminPage (Server Component — _views/leave-admin-page.tsx)
├── LeaveSetupWizard (Client Component — shown only for new organisations)
│   ├── WizardStepIndicator
│   ├── LeaveTypeSetupStep
│   │   └── LeaveTypeForm (React Hook Form + Zod)
│   ├── LeavePolicySetupStep
│   │   └── LeavePolicyForm (React Hook Form + Zod)
│   └── WizardReviewStep
│
└── LeaveAdminDashboard (Client Component — main view after setup)
    ├── LeaveStatsBar
    │   ├── PendingCountBadge
    │   ├── ApprovedThisMonthBadge
    │   └── DeclinedThisMonthBadge
    │
    ├── LeaveRequestsSection
    │   ├── LeaveRequestFilters
    │   │   ├── StatusFilterSelect
    │   │   ├── LeaveTypeFilterSelect
    │   │   ├── DepartmentFilterSelect
    │   │   └── DateRangeFilterPicker
    │   ├── LeaveRequestTable
    │   │   ├── LeaveRequestRow (×N)
    │   │   │   └── StatusBadge
    │   │   └── TableSkeletonLoader (loading state)
    │   ├── TableEmptyState
    │   └── PaginationControls
    │
    ├── LeaveRequestDetailDrawer (opens on row click)
    │   ├── EmployeeLeaveBalanceCard
    │   ├── LeaveRequestDetails
    │   ├── ApproveButton → useApproveLeaveRequest mutation
    │   └── DeclineForm (reason textarea + submit) → useDeclineLeaveRequest mutation
    │
    └── LeaveTypesSection
        ├── LeaveTypeList
        │   └── LeaveTypeCard (×N)
        │       ├── EditLeaveTypeButton → LeaveTypeFormDrawer
        │       └── ArchiveLeaveTypeButton
        ├── AddLeaveTypeButton → LeaveTypeFormDrawer
        └── LeaveTypeFormDrawer
            └── LeaveTypeForm (React Hook Form + Zod)
```

## Component Responsibilities

- **Page (Server Component)**: prefetches leave types and pending request count; passes to client boundary.
- **LeaveSetupWizard**: conditionally rendered when organisation has no configured leave types; wizard step managed by `useLeaveWizardStore`.
- **LeaveRequestFilters**: reads/writes `useLeaveFilterStore`; filter state synced to URL search params.
- **LeaveRequestTable**: pure presentational; receives rows from `useLeaveRequests` hook.
- **LeaveRequestDetailDrawer**: optimistic update on approve — row status flips immediately before server confirms.
