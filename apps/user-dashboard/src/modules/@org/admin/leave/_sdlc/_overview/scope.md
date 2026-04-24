# Leave Management — Scope

_Defines what is in and out of scope for the admin leave management module._

## In Scope

- Leave type management: create, edit, archive leave types with configurable allowance (days), accrual cycle (monthly, quarterly, annually), and eligibility rules (probation period, employment type).
- Leave request queue: paginated list of all employee leave requests filterable by status (pending, approved, declined, cancelled), leave type, department, and date range.
- Approval workflow: approve or decline individual requests with mandatory reason on decline; bulk approval for batch processing.
- Leave policy configuration: organisation-level settings such as maximum consecutive days, notice period requirements, and carry-over caps per leave type.
- First-run setup wizard: guided multi-step form to configure leave types and policy defaults for a newly onboarded organisation.
- Leave balance overview: per-employee leave balance visible to admins when reviewing a request.

## Out of Scope

- Employee-facing leave request submission (handled in `employee` module).
- Leave forecasting, analytics dashboards, and trend reports (future roadmap item).
- Integration with third-party time-tracking or payroll systems (handled at infrastructure layer separately).
- Public holiday calendar management (planned as a standalone `holidays` module).

## Boundaries

This module is a frontend admin feature consuming the HRIS backend REST API. It does not own persistence or business rule enforcement — those live in the backend domain layer. All state is managed via TanStack Query (server state) and Zustand (transient UI state such as wizard step and selected drawer).
