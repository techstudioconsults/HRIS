---
section: domain
topic: bounded-context
---

# Admin Teams — Bounded Context

## Owns

- **Team** — the core aggregate. Name, description, status, member list, roles.
- **Role** (within team) — permission set scoped to a specific team. Not to be confused with system RBAC roles.
- **TeamMember** — the association between an Employee and a Team, including their role and custom permission overrides.

## Reads From (other contexts)

| Entity       | Source Context   | How                                                                     |
| ------------ | ---------------- | ----------------------------------------------------------------------- |
| Employee     | `admin/employee` | API call to `/employees` to populate assignment search                  |
| System Roles | `admin/settings` | Used only in RBAC guard — does not read from settings module at runtime |

## Does Not Own

- The Employee entity — `admin/teams` cannot modify employee records.
- System RBAC roles — `admin/settings` owns those.
- Payroll assignments — payroll module owns the salary/pay-grade relationship to employees.

## Key Invariants

- A team must have at least one role before an employee can be assigned.
- The four default roles (Manager, Lead, Member, Observer) are created automatically on team creation.
- `TERMINATED` employees cannot be assigned to teams — enforced by backend.
- A team can have at most `maxTeamSize` (50) active members.
- Team names must be unique within an organisation.

## Status Machine

**Team status**: `active ↔ inactive → archived` (archived is soft-terminal; data retained)
**Member status**: `pending → active → inactive → removed` (removed is terminal within that team)
