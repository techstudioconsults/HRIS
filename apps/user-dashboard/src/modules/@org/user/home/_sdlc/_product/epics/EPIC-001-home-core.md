# EPIC-001: Employee Home Dashboard — Core

_Deliver a personalised, role-aware home dashboard that guides employees from login to the most relevant HR self-service actions._

## Goal

Build the two-variant home dashboard (active-user and onboarding) so that every employee, regardless of onboarding state, lands on a useful, actionable first screen.

## Acceptance Criteria (High Level)

- An employee with a complete profile sees the active-user view: personalised welcome, quick-action cards, and recent activity feed.
- A new employee without a complete profile sees the onboarding view: progress header and setup checklist.
- The dashboard switches automatically between views based on the `userSetupComplete` flag.
- All four setup task types are rendered and their states (`pending`, `completed`, `locked`) are reflected visually.
- Quick-action cards navigate correctly to `/user/leave`, `/user/payslip`, and the team view.
- The recent activity feed renders all four activity types with correct styling and timestamps.

## Stories

- US-001: View personalised welcome and quick-action cards (active-user view)
- US-002: View recent activities timeline
- US-003: View onboarding checklist and progress (onboarding view)
- US-004: Transition from onboarding to active-user view on setup completion

## Dependencies

- Auth module provides the authenticated employee's name and profile-completion status.
- Leave module provides leave activity events surfaced in the recent-activities feed.
- Payslip module signals payslip availability events for the activity feed.
