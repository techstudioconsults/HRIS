# User Home — Bounded Context

_Defines the boundary of the home module's domain responsibility._

## Context Map

```
┌─────────────────────────────────────┐
│        user/home                    │
│                                     │
│  Owns: Activity display, QuickAction│
│        config, SetupTask rendering  │
│                                     │
│  Reads from:                        │
│    - Auth session (profile state)   │
│    - Leave module (activity events) │
│    - Payslip module (activity events│
│    - Onboarding module (task states)│
│                                     │
│  Navigates to:                      │
│    - user/leave  (/user/leave)      │
│    - user/payslip (/user/payslip)   │
│    - Team view                      │
└─────────────────────────────────────┘
         ↑ reads (no writes)
┌──────────────┐  ┌───────────────┐  ┌────────────────┐
│  user/leave  │  │ user/payslip  │  │  onboarding    │
└──────────────┘  └───────────────┘  └────────────────┘
```

## Ownership Rules

- The home module **never imports** from other user modules directly for data fetching.
- Cross-module data arrives via shared API responses or session state — never via direct component imports.
- The `Activity` type is owned by the home module; leave and payslip modules produce data conforming to this shape via the backend API.

## Anti-Corruption Layer

When activity data arrives from the backend, it must be validated against the `Activity` interface before rendering. Unknown `ActivityType` values must be handled gracefully (e.g., rendered as a generic info activity rather than throwing).
