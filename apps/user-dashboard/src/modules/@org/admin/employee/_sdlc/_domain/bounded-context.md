# Admin Employee Module — Bounded Context

_Defines the domain boundary, what this context owns, and how it integrates with other contexts._

## Context Map

```
┌─────────────────────────────────────────────────────────┐
│               Employee Context (this)                   │
│                                                         │
│  Owns: Employee, EmployeeDocument, AuditEntry           │
│  Owns: EmploymentStatus lifecycle transitions           │
│  Owns: Contract terms (type, dates, probation)          │
└────────────────┬────────────────────────────────────────┘
                 │
    reads from   │              reads from
                 │
    ┌────────────▼──────┐     ┌──────────────────────┐
    │  Settings Context │     │    Leave Context      │
    │                   │     │                       │
    │  Provides:        │     │  Provides:            │
    │  Department list  │     │  LeaveBalanceSummary  │
    │  Role list        │     │  LeaveHistoryList     │
    └───────────────────┘     └──────────────────────┘

    ┌───────────────────────┐
    │   Payroll Context     │
    │                       │
    │  Provides:            │
    │  PayrollSummary       │
    │  (net pay, last run)  │
    └───────────────────────┘
```

## What This Context Owns

| Aggregate          | Responsibility                                                              |
| ------------------ | --------------------------------------------------------------------------- |
| `Employee`         | Core identity, personal info, role, department, contract, employment status |
| `EmployeeDocument` | Uploaded files attached to an employee — contract, ID, certificates         |
| `AuditEntry`       | Immutable change log for every mutation to an employee record               |

## What This Context Does NOT Own

- Leave types, leave requests, leave balances → owned by `leave` context
- Payroll runs, payslips, salary structure → owned by `payroll` context
- Department and role definitions → owned by `settings` context; employee context only references IDs
- Attendance records → owned by a future `attendance` context

## Integration Contracts

| Dependency             | Type | How                                                                |
| ---------------------- | ---- | ------------------------------------------------------------------ |
| Settings / Departments | Read | `GET /api/v1/settings/departments` — populates form dropdown       |
| Settings / Roles       | Read | `GET /api/v1/settings/roles` — populates form dropdown             |
| Leave / Balance        | Read | `GET /api/v1/leave/balance/:employeeId` — profile summary tab      |
| Leave / History        | Read | `GET /api/v1/leave?employeeId=:id` — profile leave history tab     |
| Payroll / Summary      | Read | `GET /api/v1/payroll/summary?employeeId=:id` — profile payroll tab |

## Invariants

1. An employee's email must be unique within the organisation.
2. Employment status transitions must follow the allowed state machine (see `events.md`).
3. An `AuditEntry` is created for every mutation — cannot be suppressed by callers.
4. A document's `expiryDate`, if set, must be in the future at the time of upload.
