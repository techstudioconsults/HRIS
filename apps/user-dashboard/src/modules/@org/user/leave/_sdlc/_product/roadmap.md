# User Leave — Product Roadmap

_High-level release milestones for the employee leave self-service module._

## Phase 1 — MVP (Current)

- Leave request submission form with Zod validation (`requestLeaveSchema`).
- Leave request history list with status badges (pending, approved, rejected).
- Leave details modal with full request breakdown.
- Edit and delete pending requests.
- Submission confirmation modal.

## Phase 2 — Enhancements

- Leave balance cards per leave type with real-time remaining day counts.
- Leave calendar view: employee's approved and pending leave visualised on a monthly calendar.
- Date range validation: prevent submitting requests that exceed remaining balance.
- Auto-calculate number of working days between start and end dates.

## Phase 3 — Advanced

- Leave request cancellation (after approval, requires HR counter-approval).
- Carry-over balance visibility: show how many unused days will roll over at cycle end.
- Public holiday awareness: exclude public holidays from the leave day count.
- Email/in-app notifications on status change (approved/rejected).

## Deferred / Out of Scope

- Leave approval workflow — admin module responsibility.
- Leave policy management — admin settings responsibility.
