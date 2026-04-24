# EPIC-001 — Employee Core Lifecycle Management

_Deliver the complete employee record management capability: list, create, edit, view, and manage employment status._

## Goal

Give HR administrators full control over the employee lifecycle within the HRIS — from adding a new hire's details on day one to terminating a record when they leave the organisation.

## Business Value

Replaces manual spreadsheet or paper-based employee records with a structured, auditable, searchable system. Ensures every other HRIS module (leave, payroll, attendance) operates from a consistent, up-to-date employee dataset.

## Stories Included

- US-001: View paginated employee list with search and filter
- US-002: Add a new employee via multi-section form
- US-003: Edit an existing employee's record
- US-004: View an employee's full profile (work info, documents, leave history, payroll summary)
- US-005: Change an employee's employment status (activate, deactivate, terminate)
- US-006: Upload and manage employee documents
- US-007: Use kbar keyboard shortcuts to navigate to common employee actions

## Acceptance Criteria Summary

- Employee list loads within 3 seconds; pagination, search, and filters work without full page reload
- New employee form validates all required fields before submission; duplicate email detection
- Employee profile shows data from leave and payroll modules in summary form
- All status changes record an audit trail entry with actor, timestamp, and effective date
- kbar shortcuts registered and functional for: search employee, add employee, view list

## Dependencies

- `settings` module must expose department and role lists for the employee form dropdowns
- Leave and payroll modules must expose read APIs for the profile summary sections
- File storage service must be operational for document upload

## Status

`In Progress`
