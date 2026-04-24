# EPIC-001 — Leave Management Core

_End-to-end admin leave management capability: policy setup, leave type configuration, and request approval workflow._

## Epic Goal

Deliver a production-ready admin leave management hub that allows HR admins to configure leave types, define organisational leave policies, and action employee leave requests — all from a single cohesive UI.

## Business Value

- Replaces manual leave tracking with a rules-driven, auditable system.
- Reduces leave approval turnaround time and eliminates policy inconsistencies.
- Provides employees confidence their requests are handled fairly and transparently.

## Stories in This Epic

| ID     | Title                                             | Priority | Status |
| ------ | ------------------------------------------------- | -------- | ------ |
| US-001 | View all leave requests with filters              | High     | To Do  |
| US-002 | Approve a pending leave request                   | High     | To Do  |
| US-003 | Decline a leave request with reason               | High     | To Do  |
| US-004 | Create a new leave type                           | High     | To Do  |
| US-005 | Edit an existing leave type                       | Medium   | To Do  |
| US-006 | Archive a leave type                              | Medium   | To Do  |
| US-007 | Configure organisation leave policy               | High     | To Do  |
| US-008 | First-run setup wizard for new organisation       | High     | To Do  |
| US-009 | View employee leave balance during request review | Medium   | To Do  |
| US-010 | Bulk approve pending leave requests               | Low      | To Do  |

## Acceptance Criteria (Epic-Level)

- All leave types an organisation has configured are visible and editable from the admin leave settings page.
- An HR admin can action (approve or decline) any pending leave request within 3 clicks.
- The first-run setup wizard pre-populates sensible defaults and guides the admin through all required configuration before showing the main leave dashboard.
- All approval and decline actions are recorded in an audit log with actor identity and timestamp.

## Dependencies

- Backend: `GET /api/v1/leave/requests`, `PATCH /api/v1/leave/requests/:id/approve`, `PATCH /api/v1/leave/requests/:id/decline`
- Backend: `GET /api/v1/leave/types`, `POST /api/v1/leave/types`, `PUT /api/v1/leave/types/:id`
- Backend: `GET /api/v1/leave/policy`, `PUT /api/v1/leave/policy`
- Auth: `LEAVE_ADMIN` RBAC role required on all endpoints
