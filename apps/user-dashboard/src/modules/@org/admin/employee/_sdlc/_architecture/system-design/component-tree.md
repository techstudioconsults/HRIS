# Admin Employee Module — Component Tree

_Visual breakdown of the employee module component hierarchy._

## List View Hierarchy

```
EmployeeListPage (RSC — app/admin/employee/page.tsx)
├── EmployeeListShell
│   ├── EmployeeListToolbar
│   │   ├── EmployeeSearchInput (debounced, updates URL query param)
│   │   ├── EmployeeFilterPanel (Client Component)
│   │   │   ├── DepartmentFilterSelect
│   │   │   ├── RoleFilterSelect
│   │   │   └── StatusFilterSelect
│   │   └── ActiveFilterChips
│   ├── EmployeeDataTable (Client Component — TanStack Table)
│   │   ├── EmployeeTableColumns (column definition)
│   │   ├── EmployeeTableRow[]
│   │   │   └── EmployeeRowActionMenu
│   │   │       ├── ViewProfileAction
│   │   │       ├── EditEmployeeAction
│   │   │       └── ChangeStatusAction
│   │   ├── EmployeeTableSkeleton (loading state)
│   │   └── EmployeeTableEmptyState
│   └── EmployeeTablePagination
└── AddEmployeeButton (navigates to /admin/employee/new)
```

## Add / Edit Form Hierarchy

```
EmployeeFormPage (RSC — app/admin/employee/new/page.tsx)
EmployeeEditPage  (RSC — app/admin/employee/[id]/edit/page.tsx)
└── EmployeeForm (Client Component — React Hook Form)
    ├── PersonalInfoSection
    │   ├── FirstNameField, LastNameField, EmailField, PhoneField
    │   └── DateOfBirthField, NationalIdField
    ├── RoleSection
    │   ├── RoleSelectField (loaded from settings API)
    │   └── ContractTypeSelectField
    ├── DepartmentSection
    │   ├── DepartmentSelectField (loaded from settings API)
    │   └── ReportsToSelectField
    ├── ContractSection
    │   ├── StartDateField, EndDateField (conditional on CONTRACT type)
    │   └── ProbationEndDateField
    └── EmployeeFormActions (Save, Cancel, Save & Add Another)
```

## Profile View Hierarchy

```
EmployeeProfilePage (RSC — app/admin/employee/[id]/page.tsx)
├── EmployeeProfileHeader (name, role, department, status badge, action buttons)
├── EmployeeProfileTabs (Client Component)
│   ├── WorkInfoTab
│   │   └── EmployeeWorkInfoCard
│   ├── DocumentsTab
│   │   ├── DocumentList
│   │   └── DocumentUploadButton
│   ├── LeaveHistoryTab (Client Component — fetches from leave API)
│   │   └── LeaveHistoryTable
│   └── PayrollSummaryTab (Client Component — fetches from payroll API)
│       └── PayrollSummaryCard
└── EmployeeAuditTrailDrawer (slide-out panel)
```
