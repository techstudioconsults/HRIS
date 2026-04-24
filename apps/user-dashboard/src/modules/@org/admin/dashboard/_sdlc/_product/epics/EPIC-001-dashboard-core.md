# EPIC-001 — Admin Dashboard Core

_Deliver the foundational admin dashboard surface with workforce metrics, action items, and onboarding guidance._

## Goal

Give HR administrators a single-screen view of the organisation's current HR health, highlighting items that need immediate attention and providing quick navigation to the relevant modules.

## Business Value

Reduces the time an admin spends context-switching between payroll, leave, and employee modules to understand the current state of the organisation. Increases confidence in day-to-day HR operations.

## Stories Included

- US-001: View headcount and attendance summary widgets
- US-002: View pending leave approvals banner
- US-003: View upcoming payroll run summary
- US-004: View recent HR activity feed
- US-005: View onboarding progress checklist (new organisations only)
- US-006: View leave-by-department summary for the current week

## Acceptance Criteria Summary

- All metric widgets load within 3 seconds on a standard broadband connection
- Onboarding banner is shown only when setup steps remain incomplete
- Each pending action item links directly to the corresponding action screen

## Dependencies

- Auth/session endpoint must return organisation onboarding status
- Leave, payroll, and employee APIs must be available and documented
- Design system components (Card, Badge, Skeleton) must be available in the shared UI package

## Status

`In Progress`
