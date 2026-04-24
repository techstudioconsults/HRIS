# Admin Employee Module — Roadmap

_Phased delivery plan for the employee management module._

## Phase 1 — MVP (Current)

Target: Full CRUD for employee records; list, add, edit, view, status management.

| Story  | Description                                                                  | Status      |
| ------ | ---------------------------------------------------------------------------- | ----------- |
| US-001 | Paginated employee list with search and filter                               | In Progress |
| US-002 | Add new employee — multi-section form                                        | TODO        |
| US-003 | Edit existing employee record                                                | TODO        |
| US-004 | Employee profile view (work info, documents, leave summary, payroll summary) | TODO        |
| US-005 | Employment status management (activate, deactivate, terminate)               | TODO        |
| US-006 | Employee document upload and management                                      | TODO        |
| US-007 | kbar keyboard shortcut integration                                           | TODO        |

## Phase 2 — Enhanced Management

Target: Richer data entry, import, and role change workflows.

- Employee transfer: change department with effective date and org-chart impact preview
- Role change workflow: formal approval for role promotions
- Bulk actions: activate/deactivate multiple employees at once
- CSV bulk import: upload a spreadsheet of new hires
- Employee ID auto-generation based on configurable format (e.g., `ORG-0001`)

## Phase 3 — Self-Service & Advanced

Target: Reduce admin burden through employee self-service and automation.

- Self-service profile update: employees submit changes pending admin approval
- Org chart view: interactive visualisation of department hierarchy
- Onboarding workflow: automated checklist of tasks for new hires (probation period tracking)
- Document expiry alerts: automated notifications before work permits or certifications expire
- Integration with external identity providers (Google Workspace, Azure AD)

## Deferred / Parking Lot

- Performance review module (separate epic)
- Compensation benchmarking (requires external salary data — evaluate separately)
