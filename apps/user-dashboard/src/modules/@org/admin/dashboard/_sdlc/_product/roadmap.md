# Admin Dashboard — Roadmap

_Phased delivery plan for the admin dashboard module._

## Phase 1 — MVP (Current)

Target: Core metrics visible on first login; actionable pending items surfaced.

| Story  | Description                              | Status      |
| ------ | ---------------------------------------- | ----------- |
| US-001 | Headcount and attendance summary widgets | In Progress |
| US-002 | Pending leave approvals banner           | TODO        |
| US-003 | Payroll run summary widget               | TODO        |
| US-004 | Recent HR activity feed                  | TODO        |
| US-005 | Onboarding progress checklist            | TODO        |
| US-006 | Leave-by-department weekly summary       | TODO        |

## Phase 2 — Enhanced Insights

Target: Trend data, drill-down navigation, and richer filtering.

- Attendance trend sparklines (6-month rolling window)
- Headcount growth chart (hire vs. attrition over 12 months)
- Payroll cost trend by department
- One-click drill-down from each widget to the relevant module list view

## Phase 3 — Configurable Dashboard (Post-MVP)

Target: Admins can personalise their dashboard layout.

- Drag-and-drop widget reordering (persisted per user)
- Show/hide individual widgets based on role or preference
- Date range selector to pivot all metrics to a custom period
- Export dashboard snapshot as PDF

## Deferred / Parking Lot

- Cross-organisation benchmarking (requires multi-tenant data aggregation — evaluate later)
- Real-time push updates via WebSocket (evaluate after MVP usage data is gathered)
