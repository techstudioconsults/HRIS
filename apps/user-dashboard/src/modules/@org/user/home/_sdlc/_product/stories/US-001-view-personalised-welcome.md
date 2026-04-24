# US-001: View Personalised Welcome and Quick-Action Cards

_As an active employee, I want to see a personalised welcome message and quick-action cards so that I can navigate to the most important HR actions in one click._

## Story

**As** an employee with a complete profile,
**I want** to see my name in the welcome header and three quick-action cards (Request Leave, View Payslip, View Team),
**So that** I can reach the most common self-service actions without searching through menus.

## Acceptance Criteria

- See `AC-001-active-user-view-renders.md`.
- The welcome header displays the authenticated employee's first name.
- Three quick-action cards are visible: "Request Leave", "View Payslip", "View Team".
- Each card has a title, description, and a button that navigates to the correct route.
- If profile setup is incomplete (`userSetupComplete === false`), the active-user view is NOT shown; the onboarding view renders instead.

## Notes

- Route: `/user/dashboard`
- Component: `_views/active-user/index.tsx`
- Quick-action data is typed via the `QuickAction` interface in `types/index.ts`.
