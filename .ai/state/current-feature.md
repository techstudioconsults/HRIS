# Current Feature Context

**Feature Name**: Team Details — Fix Sub-Teams Tab Backend Search
**Status**: ✅ Done
**Started**: 2026-05-02
**Completed**: 2026-05-02T13:08:00

---

## Feature Goal

Refactor the `/admin/teams/[id]` (TeamDetails) view so the body below the stats cards
switches between two tabs:

| Tab              | Slug                | Content                                                                                                                                   |
| ---------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| All Team Members | `members` (default) | Table of all employees in the team (direct + sub-team members) — columns: Team Members, Email, Role, Work Mode, Sub Team, Status, Actions |
| Sub Teams        | `sub-teams`         | Existing sub-teams table — unchanged                                                                                                      |

A shared search input (placeholder _"Search sub team, member..."_) filters whichever
tab is active. Tab selection is persisted as a nuqs URL param (`?tab=members|sub-teams`).

---

## Acceptance Criteria

- [x] **AC-001** — Navigating to `/admin/teams/[id]` shows the "All Team Members" tab active by default.
- [x] **AC-002** — Clicking "Sub Teams" tab shows the existing sub-teams table.
- [x] **AC-003** — Tab selection is preserved on page refresh (`?tab=members` or `?tab=sub-teams` in URL).
- [x] **AC-004** — The search input filters the active tab's data client-side (name, email, role, sub-team name, work mode).
- [x] **AC-005** — All Team Members table shows columns: Team Members (avatar+name), Email, Role, Work Mode, Sub Team, Status, Actions.
- [x] **AC-006** — "Sub Team" column shows the sub-team name the employee belongs to; shows "Unassigned" in destructive colour for direct team members.
- [x] **AC-007** — Existing modals (edit-team, add-sub-team, delete-confirm) continue to work correctly.
- [x] **AC-008** — No TypeScript errors; strict mode passes.
- [x] **AC-009** — No existing functionality regresses (sub-team navigation, edit/delete row actions).

---

## Files Modified

- `apps/user-dashboard/src/lib/nuqs/use-team-details-modal-params.ts`
- `apps/user-dashboard/src/modules/@org/admin/teams/_views/team-details/index.tsx`
