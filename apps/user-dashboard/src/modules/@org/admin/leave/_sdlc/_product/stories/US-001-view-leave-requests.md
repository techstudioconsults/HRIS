# US-001 — View All Leave Requests

_As an HR admin, I want to see all employee leave requests in a paginated, filterable table so I can quickly find and action requests that need attention._

## Story

**As** an HR admin,
**I want** to view all employee leave requests in a centralised table with filter and sort controls,
**So that** I can triage pending requests efficiently and maintain visibility over past decisions.

## Acceptance Criteria

- The leave requests table displays: employee name, department, leave type, start date, end date, duration (days), status badge, and submitted date.
- Default view shows `pending` requests sorted by submitted date ascending (oldest first).
- Admin can filter by: status (pending, approved, declined, cancelled), leave type, department, and date range.
- The table is paginated (20 rows per page by default) with `page`, `size`, `sort` query params synced to the URL.
- Clicking a row opens a detail drawer showing the full request, the employee's current leave balance, and approve/decline action buttons.
- An empty state is shown when no requests match the current filters.

## Technical Notes

- Data fetched via TanStack Query; query key registered in `src/lib/react-query/query-keys.ts`.
- Filter state stored in Zustand `useLeaveFilterStore` — does not trigger a page reload.
- Response conforms to paginated envelope: `{ data, total, page, size, totalPages }`.
- Status badges use semantic colour tokens: `pending` → amber, `approved` → green, `declined` → red.

## Linked Artifacts

- Epic: EPIC-001
- AC: AC-001-leave-request-table
- API: `GET /api/v1/leave/requests`
