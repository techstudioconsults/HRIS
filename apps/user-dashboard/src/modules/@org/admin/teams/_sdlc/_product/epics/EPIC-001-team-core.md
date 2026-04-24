---
section: product
topic: epic
id: EPIC-001
---

# EPIC-001 — Core Team Management

## Goal

Enable admins to build and maintain team structures within their organisation: create teams, define roles, and assign employees — all through a guided, sequential workflow.

## User Stories

| ID     | Story                                                                    | Priority |
| ------ | ------------------------------------------------------------------------ | -------- |
| US-001 | As an admin, I can create a new team with a name and description         | P0       |
| US-002 | As an admin, I can add a custom role to a team with specific permissions | P0       |
| US-003 | As an admin, I can assign an employee to a team with a specific role     | P0       |
| US-004 | As an admin, I can view all teams in a paginated, searchable table       | P0       |
| US-005 | As an admin, I can edit a team's name, description, and metadata         | P1       |
| US-006 | As an admin, I can delete a team (with confirmation)                     | P1       |
| US-007 | As an admin, I can view team details and member roster                   | P1       |
| US-008 | As an admin, I can export the team roster to CSV/Excel                   | P2       |
| US-009 | As an admin, I can filter and search teams by name, role, or team ID     | P1       |

## Acceptance Criteria (high-level)

- Team creation requires name (2–100 chars) and description (10–500 chars).
- Default roles (Manager, Lead, Member, Observer) are pre-created for every new team.
- Assigned employee must exist in the organisation.
- Roster export is a blob download; filename includes team name and date.
- All mutations require `ADMIN` permission.

## Dependencies

- Employee list API (`GET /employees`) — needed for employee assignment step.
- Roles API (`GET /teams/:id/roles`) — shared with onboarding module via `organization-service`.
