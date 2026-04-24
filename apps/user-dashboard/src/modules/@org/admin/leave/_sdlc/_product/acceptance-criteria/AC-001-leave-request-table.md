# AC-001 — Leave Request Table Acceptance Criteria

_Formal acceptance criteria for the leave requests table view, covering rendering, filtering, pagination, and error states._

## Scenario 1: Table renders with pending requests

**Given** an HR admin navigates to `/admin/leave`
**And** there are pending leave requests in the system
**When** the page loads
**Then** the table displays all pending requests sorted by submission date (oldest first)
**And** each row shows employee name, leave type, date range, duration in days, and an amber "Pending" status badge

## Scenario 2: Filter by status

**Given** the admin is on the leave requests page
**When** the admin selects "Approved" from the status filter
**Then** only approved requests are displayed
**And** the URL updates to include `?status=approved`
**And** the row count badge updates accordingly

## Scenario 3: Empty state

**Given** the admin applies a filter combination that yields no results
**When** the query returns an empty data array
**Then** an empty state illustration and message are displayed: "No leave requests match your current filters"
**And** a "Clear filters" button is visible and functional

## Scenario 4: Pagination

**Given** there are more than 20 leave requests matching the current filters
**When** the admin is on page 1
**Then** a pagination control is shown at the bottom of the table
**And** clicking page 2 fetches the next 20 records
**And** the URL updates to include `?page=2`

## Scenario 5: Loading and error states

**Given** the leave requests API call is in flight
**When** the data has not yet resolved
**Then** a skeleton loader is shown in place of the table rows
**And** if the API returns a non-2xx response, an error banner is shown with a retry button
