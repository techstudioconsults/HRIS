# User Leave — Bounded Context

_Domain boundary and integration contracts for the employee self-service leave module._

## Context Map

```
┌──────────────────────────────────────────────────────┐
│            User Leave Context (this)                  │
│                                                       │
│  Owns: LeaveRequest (employee-submitted)              │
│  Reads: LeaveType, LeaveBalance                       │
└──────────────┬────────────────────────────────────────┘
               │ reads from
               │
    ┌──────────▼──────────────┐
    │   Admin Leave Context   │
    │                         │
    │  Provides: LeaveType[]  │
    │  Provides: LeaveBalance │
    │  Owns: approval flow    │
    └─────────────────────────┘
```

## What This Context Owns

| Entity                            | Responsibility                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `LeaveRequest` (employee-created) | The employee's own submissions: create, read, update (pending only), delete (pending only) |

## What This Context Does NOT Own

- Leave types and their configuration — owned by `admin/leave` context
- Leave balances calculation — backend-computed, surfaced read-only to this context
- Leave approval and rejection — owned by `admin/leave` context
- Team leave overview or calendar — future admin/team-lead feature

## Invariants

1. An employee can only view, create, edit, and delete their **own** leave requests — enforced both at the API level (JWT-scoped) and frontend (no cross-employee ID exposure).
2. Edit and delete actions are only available when `status === 'pending'`.
3. `rejectionReason` is read-only for the employee — it cannot be set from this context.
4. The employee cannot modify their own `LeaveBalance` directly; it is a derived read-only value.
