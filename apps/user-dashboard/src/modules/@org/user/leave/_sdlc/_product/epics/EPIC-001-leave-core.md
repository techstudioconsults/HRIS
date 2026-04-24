# EPIC-001: Employee Leave Self-Service — Core

_Deliver a complete self-service leave management experience for employees: view balances, submit requests, and track request history._

## Goal

Allow employees to manage their leave end-to-end without HR intervention — from checking their remaining balance to submitting a request and tracking its outcome.

## Acceptance Criteria (High Level)

- Employee can view their leave balance per leave type (total, used, remaining, pending).
- Employee can submit a leave request via a validated form (Zod schema).
- Employee sees a confirmation modal immediately after a successful submission.
- Employee can view all their past and current leave requests with status indicators.
- Employee can click a request card to view full details in a modal.
- Employee can edit a pending request.
- Rejected requests show the rejection reason.

## Stories

- US-001: View leave balance per leave type
- US-002: Submit a new leave request
- US-003: View submission confirmation
- US-004: View leave request history
- US-005: View leave request details modal
- US-006: Edit a pending leave request

## Dependencies

- Backend `GET /leaves` — leave type list (for form selector)
- Backend `GET /leave-request` — employee's own requests
- Backend `POST /leave-request` — create new request
- Backend `PATCH /leave-request/{id}` — update pending request
