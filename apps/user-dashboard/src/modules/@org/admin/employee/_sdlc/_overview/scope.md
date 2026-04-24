# Admin Employee Module — Scope

_Defines what is included and excluded from the employee management module._

## In Scope

- Employee list view: paginated table with search by name/ID/email, filter by department/status/role
- Add employee: multi-section form covering personal info, contact details, role assignment, department, and contract type
- Edit employee: update any field across all sections of an employee's profile
- Employee detail view: read-only profile showing work info, assigned role, department, contract, documents list, leave history summary, and payroll summary
- Employee status management: activate, deactivate, terminate with effective date
- Document management: upload, list, and download employee documents (contract, ID, certificates); expiry date tracking
- Keyboard shortcut integration via kbar: quick-search employees, navigate to add form, trigger status change
- Audit trail: every change to an employee record logs who changed what and when

## Out of Scope

- Leave request creation or approval (owned by the `leave` module)
- Payroll calculation, processing, or approval (owned by the `payroll` module)
- Attendance tracking and reporting (owned by a dedicated attendance module)
- Bulk employee import (post-MVP, tracked in roadmap)
- Self-service employee profile editing (post-MVP)
- Performance review management

## Assumptions

- Employee documents are stored via a backend file service; the frontend handles upload/download only.
- Leave and payroll summary data shown on the employee profile is fetched from the respective modules' APIs — the employee module does not own that data.
- Role and department lists are managed via the `settings` module; this module only assigns them, not creates them.
