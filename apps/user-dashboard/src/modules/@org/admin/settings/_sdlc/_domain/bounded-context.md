# Settings Module — Bounded Context

_Domain boundary and integration contracts for the settings module._

## Context Map

```
┌──────────────────────────────────────────────────────┐
│              Settings Context (this)                  │
│                                                       │
│  Owns: AccountSettings, PayrollSettings,              │
│        SecuritySettings, HRSettings,                  │
│        NotificationSettings, Role, Permission         │
└────────────────────┬──────────────────────────────────┘
                     │
       consumed by   │ provides reference data to
                     │
    ┌────────────────▼──────────┐
    │     Employee Context      │
    │                           │
    │  Reads: Department list   │
    │         Role list         │
    └───────────────────────────┘

    ┌───────────────────────────┐
    │      Leave Context        │
    │                           │
    │  Reads: HRSettings        │
    │  (probation period,       │
    │   leave carryover rules)  │
    └───────────────────────────┘

    ┌───────────────────────────┐
    │     Payroll Context       │
    │                           │
    │  Reads: PayrollSettings   │
    │  (pay cycle, currency,    │
    │   deduction rules)        │
    └───────────────────────────┘
```

## What This Context Owns

| Aggregate              | Responsibility                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| `AccountSettings`      | Organisation identity: name, logo, contact info, registration number      |
| `PayrollSettings`      | Payroll processing config: pay cycle, currency, deductions                |
| `SecuritySettings`     | Access policy: 2FA enforcement, session timeout, password rules           |
| `HRSettings`           | HR operational defaults: working hours, probation period, leave carryover |
| `NotificationSettings` | Per-event notification toggles for email and in-app channels              |
| `Role`                 | Custom and system-defined roles with permission scopes                    |
| `Permission`           | Discrete access grant strings assigned to roles                           |

## What This Context Does NOT Own

- Individual user notification preferences (user profile concern)
- Attendance rules (future attendance context)
- Billing / subscription config (platform-level concern, not in scope)

## Invariants

1. `organisationId` is always derived from the authenticated JWT — never from the client payload.
2. System-defined roles (`SUPER_ADMIN`, `HR_MANAGER`, `HR_OFFICER`, `EMPLOYEE`) cannot be mutated or deleted.
3. Each settings domain record is unique per organisation (one AccountSettings per org, not a list).
4. Payroll settings changes take effect from the next pay cycle — changes are not retroactive.
5. All settings mutations persist `updatedBy` and `updatedAt` — these cannot be suppressed.
