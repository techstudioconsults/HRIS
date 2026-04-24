# AC-001 — Headcount Widget Acceptance Criteria

_Formal acceptance criteria for the headcount and attendance summary widget on the admin dashboard._

## Given / When / Then

### Scenario 1: Happy path — data available

- **Given** the admin is authenticated and navigates to `/admin/dashboard`
- **When** the headcount API returns a valid response within 3 seconds
- **Then** the widget displays: total employees, active count, currently-on-leave count, and terminated-this-month count as labelled numeric values

### Scenario 2: Loading state

- **Given** the admin navigates to `/admin/dashboard`
- **When** the headcount API has not yet responded
- **Then** a skeleton loader is rendered in place of the numeric values — no layout shift on data arrival

### Scenario 3: API error

- **Given** the headcount API returns a 5xx error or times out
- **Then** the widget displays a user-friendly error message ("Unable to load headcount data") with a retry button — no raw error details exposed

### Scenario 4: Zero employees

- **Given** the organisation has no employees yet
- **Then** the widget renders with all counts at 0 and a prompt linking to the employee module to add the first employee

## Non-functional Requirements

- Widget must be keyboard accessible (focusable, readable by screen readers with appropriate aria-labels)
- Values must be formatted with locale-aware number formatting (e.g., 1,200 not 1200)
- No inline styles — Tailwind utility classes only
