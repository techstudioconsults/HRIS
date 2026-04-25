---
section: domain
topic: bounded-context
---

# Onboarding — Bounded Context

## Context Name

**CompanySetup**

## Responsibility

Guides a newly registered company owner through the one-time setup of their organization structure: company profile, teams, roles, and initial employee invitations.

## Context Boundary

```
┌───────────────────────────────────────────────────────────────┐
│  CompanySetup                                                 │
│                                                               │
│  Aggregates: CompanyProfile, Team (with Roles), Employee      │
│  Services:   OnboardingService                                │
│  Operations:                                                  │
│    PATCH /companies/current                                   │
│    CRUD  /teams, /roles                                       │
│    POST  /employees/onboard                                   │
│    GET/PATCH /employees/:id/setup                             │
└───────────────────────────────────────────────────────────────┘
          │ initializes data for
          ▼
┌───────────────────────────────────────────────────────────────┐
│  admin/teams  — ongoing team/role management post-onboarding  │
│  admin/employee — ongoing employee management                 │
│  admin/payroll, admin/leave — depend on setup being complete  │
└───────────────────────────────────────────────────────────────┘
```

## Upstream Dependencies

| Context                    | What We Consume                                          |
| -------------------------- | -------------------------------------------------------- |
| `IdentityAndAccess` (auth) | JWT session — all API calls require authentication       |
| Backend API                | `/companies/current`, `/teams`, `/roles`, `/employees/*` |

## Anti-Corruption Notes

- `Team` and `Role` types in this module are the onboarding-phase representations. Post-onboarding, the same entities are managed by `admin/teams` — they share the same backend models but different UI ownership.
- `OnboardingSetupStatus` is an onboarding-only concern. It is not imported or used by any other module.
- `OnboardingService` is NOT shared with `admin/*` modules. Admin modules have their own service layer.
