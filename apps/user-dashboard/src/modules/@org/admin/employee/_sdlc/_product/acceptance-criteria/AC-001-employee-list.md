# AC-001 — Employee List Acceptance Criteria

_Formal acceptance criteria for the paginated employee list view._

## Given / When / Then

### Scenario 1: Happy path — employees exist

- **Given** the admin is authenticated and navigates to `/admin/employee`
- **When** the employee list API returns a paginated response within 3 seconds
- **Then** a table is displayed with columns: Name, Employee ID, Department, Role, Status, Start Date, and an Actions menu

### Scenario 2: Search by name

- **Given** the employee list is displayed
- **When** the admin types "John" in the search input
- **Then** after 300ms debounce, only employees whose name, ID, or email contains "John" (case-insensitive) are shown
- **And** the search term is reflected in the URL query string (`?q=John`) to support bookmarking

### Scenario 3: Filter by department

- **Given** the employee list is displayed
- **When** the admin selects "Engineering" from the Department filter
- **Then** only employees assigned to the Engineering department are shown
- **And** an "Engineering" badge chip appears above the table with an X to dismiss the filter

### Scenario 4: Pagination

- **Given** there are 47 employees in the organisation
- **When** the admin views the list with 20 rows per page
- **Then** page 1 shows rows 1–20, the pagination footer shows "Page 1 of 3", and next/previous controls are enabled appropriately

### Scenario 5: Empty search result

- **Given** the admin searches for "zzz_nonexistent"
- **Then** the table is replaced with an empty state: "No employees found matching your search. Clear filters to see all employees."

### Scenario 6: Loading state

- **When** the API has not yet responded
- **Then** skeleton rows (matching the table column layout) are rendered in place of data rows

## Non-functional Requirements

- Table must be keyboard navigable: Tab between rows, Enter to open Action menu
- Status badges must use colour + text (not colour alone) to indicate ACTIVE / INACTIVE / TERMINATED
- The list must handle 1,000+ employees without UI degradation (virtual scrolling if needed)
