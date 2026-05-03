# Sub-team Feature Parity Implementation

**Feature**: Sub-team module — full feature parity with team module
**Status**: ✅ Complete
**Date**: 2026-05-03

---

## What Was Done

Refactored the sub-team views and sub-team details page to match the full functionality of the team module.

### 1. Sub-team Row Actions (`_views/table-data.tsx`)

- Removed `teamType === 'team'` guard from "Add Role" and "Add Employees" actions
- Sub-team rows in the sub-teams tab now show: View, Edit, **Add Role**, **Add Members**, Delete
- Label is "Add Members" for sub-teams, "Add Employees" for teams
- Updated `useSubTeamRowActions` to accept `onAddRole` and `onAddMembers` callbacks

### 2. Team Details — Sub-team Dialogs (`team-details/index.tsx`)

- Added inline "Add Role" dialog for sub-teams (triggered from row action)
- Added inline "Add Members" dialog for sub-teams using `AddNewEmployees` form
- Added `selectedSubTeam` state to track which sub-team is being modified
- Uses `useCreateRole` and `useAssignEmployeeToTeam` mutations (same endpoints as team)
- Passes `onAddSubTeamRole` and `onAddSubTeamMembers` down to `TeamDetailsContent`

### 3. Team Details Content (`team-details/components/team-details-content.tsx`)

- Added `onAddSubTeamRole` and `onAddSubTeamMembers` optional props
- Passes them to `useSubTeamRowActions`

### 4. Sub-team Details Page (`sub-team-details/index.tsx`)

- Fixed React hooks violations: all mutations now hoisted to top-level (not called inside callbacks)
- Replaced `AddNewMembers` with `AddNewEmployees` for employee assignment (same as team)
- Wired up previously unused `isEmployeeOpen`/`openEmployeeDialog` from `useSubTeamModalParams`
- Fixed duplicate `closeModal` destructuring bug
- Replaced inline `AlertModal` for delete confirmation (instead of relying on row-action modal)
- Uses `useAssignEmployeeToTeam` mutation for employee assignment

### 5. Sub-team Details Header (`sub-team-details-header.tsx`)

- Renamed `onAddMember` → `onAddEmployee`
- Button label: "Add Member" → "Add Employee"

### 6. Sub-team Details Content (`sub-team-details-content.tsx`)

- Renamed `onAddMember` → `onAddEmployee`
- Fixed all import paths to use `@/` absolute aliases (pre-existing relative path bugs)
- Fixed `Role` type incompatibility with `DataItem` using `RoleRow = Role & Record<string, unknown>`

---

## Architecture Notes

- Sub-team and team follow the same endpoint: `POST /teams/:id/employees` via `useAssignEmployeeToTeam`
- Sub-team row actions in the sub-teams tab mirror team list row actions exactly
- `useSubTeamModalParams` `'employee'` modal type is now fully wired (previously defined but unused)
- No new dependencies added
