# US-001 — View Paginated Employee List

_As an HR administrator, I want to see a searchable, filterable list of all employees so I can quickly find the person I need to take action on._

## Context

The employee list is the primary entry point for all employee management tasks. Admins use it daily to find employees by name, check who is in a given department, or audit who has a specific employment status.

## Acceptance Criteria

- See AC-001 for full criteria

## Definition of Done

- [ ] Table renders with columns: Name, Employee ID, Department, Role, Status, Start Date, Actions
- [ ] Pagination controls: previous/next and page size selector (default 20 rows per page)
- [ ] Search input filters results by name, employee ID, or email in real time (debounced 300ms)
- [ ] Filter panel: filter by Department, Role, Employment Status (multi-select)
- [ ] Active filters shown as dismissible badge chips above the table
- [ ] Skeleton rows shown while data is loading
- [ ] Empty state shown when search/filter returns no results
- [ ] Each row's action menu includes: View Profile, Edit, Change Status
- [ ] kbar shortcut `Mod+K` → type "employees" navigates to this list

## Design Reference

See `_sdlc/_design/figma-links.md`.

## Notes

- Search is server-side — the API accepts a `q` query param; do not filter client-side
- All list API calls must include pagination params; no unbounded fetches
