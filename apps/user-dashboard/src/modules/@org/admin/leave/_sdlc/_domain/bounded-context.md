# Leave Management — Bounded Context

_Defines the leave context's ownership boundaries and how it integrates with neighbouring contexts._

## Context Map

```
┌─────────────────────────────────────────────────────────────┐
│                    Leave Context                            │
│                                                             │
│  LeaveType  ──────── governs ──────── LeaveRequest          │
│      │                                      │               │
│      │                                      ↓               │
│      │                               LeaveBalance           │
│      │                                      │               │
│  LeavePolicy ──── constrains ────────────────               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        │                         │
        ↓ (reads employee info)   ↓ (may notify)
┌───────────────┐        ┌─────────────────────┐
│   Employee    │        │  Notification        │
│   Context     │        │  Context             │
│               │        │  (email, push)       │
└───────────────┘        └─────────────────────┘
```

## Owned by Leave Context

- `LeaveType` — full lifecycle ownership (create, edit, archive).
- `LeaveRequest` — full lifecycle ownership (create, approve, decline, cancel).
- `LeaveBalance` — calculated and owned by leave context; read-only to other contexts.
- `LeavePolicy` — organisation-level configuration; owned exclusively by leave context.

## Shared Kernel (Read-Only from Leave Context)

- `Employee.id`, `Employee.name`, `Employee.department` — referenced in `LeaveRequest` but never mutated.
- `Organisation.id` — used to scope leave types and policies per organisation.

## Anti-Corruption Layer

When consuming employee data from the Employee context, the leave service maps to an internal `LeaveRequestEmployee` projection. This prevents Employee context internals from leaking into leave domain models — if the Employee context changes its shape, only the mapper updates.

## Downstream Consumers of Leave Context

- **Payroll Context**: reads `LeaveBalance` (used leave days) to calculate deductions for unpaid leave and to verify pay period attendance. Read-only; never writes to leave entities.
- **Notification Context**: subscribes to `LeaveRequestApproved` and `LeaveRequestDeclined` events to send email/push notifications to employees. Event-driven; no direct dependency on leave entities.
- **Reporting Context** (future): reads aggregated leave usage data for analytics. View-only.
