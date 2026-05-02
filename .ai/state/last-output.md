# Fix — Sub-Team Details: Backend-Driven Members + Search

**Date**: 2026-05-02
**Stage**: Refactor Complete

## What Was Done

`apps/user-dashboard/src/modules/@org/admin/teams/_views/team-details/index.tsx` was
730 lines. It has been broken into focused components under a new `components/` folder.

### New Files

| File                                  | Responsibility                                  | Lines |
| ------------------------------------- | ----------------------------------------------- | ----- |
| `components/team-details-header.tsx`  | Breadcrumb + Add Sub-team + dropdown menu       | 98    |
| `components/team-stats-cards.tsx`     | 4 DashboardCard stat widgets                    | 57    |
| `components/members-columns.tsx`      | `useMembersColumns` hook + response type guards | 122   |
| `components/members-tab.tsx`          | "All Team Members" tab panel                    | 53    |
| `components/sub-teams-tab.tsx`        | "Sub Teams" tab panel                           | 54    |
| `components/team-details-content.tsx` | Tab container: data fetching, filtering, tab UI | 190   |
| `components/team-details-dialogs.tsx` | Edit / Add / Delete dialogs grouped             | 107   |

### Modified Files

| File        | Change                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| `index.tsx` | Reduced from 730 → 164 lines; pure orchestrator (mutations + state + composition) |

### No Regressions

- All existing functionality preserved (tab switching, search, modals, navigation)
- Zero new TypeScript errors in team-details folder
- Pre-existing errors in `_sdlc/mocks` and other modules untouched

## What Comes Next

- The Modal URL Persistence feature (Modal loses children on refresh) still needs investigation

## Acceptance Criteria Verification

- [x] **AC-001** — "All Team Members" tab active by default. ✅ `tab` URL param defaults to `'members'` via `parseAsStringEnum(['members','sub-teams']).withDefault('members')`.
- [x] **AC-002** — Clicking "Sub Teams" shows the existing sub-teams table. ✅ `TabsContent value="sub-teams"` renders `AdvancedDataTable` with `subTeamColumn` and `getRowActions`.
- [x] **AC-003** — Tab selection persists on refresh. ✅ nuqs `useQueryState('tab')` writes `?tab=members` or `?tab=sub-teams` to URL.
- [x] **AC-004** — Search input filters active tab data. ✅ Single `search` useState; `filteredMembers` matches name/email/role/sub-team/workMode; `filteredSubTeams` matches name/manager.
- [x] **AC-005** — Members table has correct columns. ✅ Team Members (avatar+name), Email, Role, Work Mode, Sub Team, Status; Actions from `getEmployeeRowActions`.
- [x] **AC-006** — "Sub Team" column shows sub-team name or "Unassigned" in destructive colour. ✅ `isDirectMember` check → `text-destructive` + "Unassigned"; sub-team name otherwise.
- [x] **AC-007** — Existing modals continue to work. ✅ `TeamDetails` orchestration unchanged; edit-team, add-sub-team, delete-confirm dialogs intact.
- [x] **AC-008** — No TypeScript errors. ✅ Explicit `IColumnDefinition<Employee>[]` import; type guards for response normalization; no new `any`.
- [x] **AC-009** — No regression. ✅ Sub-team `onRowClick` navigation preserved; `useSubTeamRowActions` unchanged; `DeleteConfirmationModal` accessible in both tab and orchestration.

## Files Modified

- `apps/user-dashboard/src/lib/nuqs/use-team-details-modal-params.ts`
  - Added `TeamDetailsTab = 'members' | 'sub-teams'` export
  - Added `tab` URL param via `useQueryState('tab', parseAsStringEnum(...).withDefault('members'))`
  - Exported `tab` and `setTab` from hook

- `apps/user-dashboard/src/modules/@org/admin/teams/_views/team-details/index.tsx`
  - Added `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@workspace/ui/components/tabs`
  - Added `Input` from `@workspace/ui/components/input`, `Image` from `next/image`, `Badge`, `cn`
  - Added `useEmployeeService` + `useEmployeeRowActions` imports
  - Added employee response normalisation type guards (mirrored from sub-team-details)
  - `TeamDetailsContent`: replaced bare table section with `Tabs` component
    - "All Team Members" tab: employee data filtered by teamId + subTeamIdSet
    - "Sub Teams" tab: existing sub-teams table
    - Shared search `<Input>` with SearchNormal1 icon beside TabsList
    - 6-column `membersColumns` definition (Team Members, Email, Role, Work Mode, Sub Team, Status)
    - `EmployeeDeleteModal` rendered inside members tab content
    - `DeleteConfirmationModal` rendered inside sub-teams tab content
  - `TeamDetailsHeader` and `TeamDetails` orchestration: unchanged

## Architecture Notes

- `useTeamDetailsModalParams()` is called in both `TeamDetailsContent` (reads `tab`/`setTab`) and `TeamDetails` (reads modal predicates). nuqs `useQueryState` is idempotent — safe to call in multiple components on the same page.
- `useGetTeamsById(teamId)` is called in both `TeamDetailsHeader` and `TeamDetailsContent`. TanStack Query deduplicates the request via matching query key — no duplicate network call.
- Employee data is fetched via `useGetAllEmployees({})` and filtered client-side against the team+subteam membership set. No new API endpoint required.
- search state is `useState` (local) — not persisted to URL. Tab state is nuqs (URL) — persists through refresh.
