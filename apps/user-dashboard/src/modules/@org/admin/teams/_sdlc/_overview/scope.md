---
section: overview
topic: scope
---

# Admin Teams — Scope

## In Scope

- Create, update, and delete teams within an organisation.
- Create and update roles within a team (with configurable permission sets).
- Assign employees to teams with a specific role; support custom per-member permission overrides.
- Multi-step guided workflow: Team → Role → Employee (sequenced dialog flow via Zustand).
- View all teams in a paginated, filterable table.
- Drill into team details and sub-team details.
- Export team roster to CSV/Excel (blob download).
- Filter teams by name, role, and team ID.

## Out of Scope

- Team chat, calendar, documents, goals, and budget (config flags exist but features are future scope).
- Cross-organisation team membership.
- Self-join by employees (disabled by config: `allowSelfJoin: false`).
- Team analytics and reporting dashboard.

## Constraints

- Maximum 50 members per team (`maxTeamSize: 50`).
- Maximum 20 roles per team (`maxRoles: 20`).
- Team name: 2–100 characters; description: 10–500 characters.
- Manager approval required for all membership changes (`requireManagerApproval: true`).
- Teams have 4 default roles: Manager, Lead, Member, Observer.
