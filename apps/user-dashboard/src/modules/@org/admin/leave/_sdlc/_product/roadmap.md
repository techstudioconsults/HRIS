# Leave Management — Product Roadmap

_Phased delivery plan for the admin leave management module, ordered by business value and dependency._

## Phase 1 — Foundation (MVP)

Target: Sprint 1–2

- First-run setup wizard (leave types + policy defaults)
- Leave type management: create, edit, archive
- Organisation-wide leave policy configuration
- Leave request table with status/type/department filters
- Approve and decline individual requests

## Phase 2 — Operational Efficiency

Target: Sprint 3–4

- Bulk approve/decline for batch processing
- Employee leave balance visible in request detail drawer
- Carry-over configuration per leave type
- Notice period enforcement in request validation
- Audit log view: full history of all approval/decline actions with actor and timestamp

## Phase 3 — Advanced Configuration

Target: Sprint 5–6

- Leave type eligibility rules: employment type (full-time, part-time, contract) and minimum tenure
- Delegation: allow HR admin to delegate approval authority to a line manager for a defined period
- Leave type accrual: monthly accrual model in addition to upfront annual grant
- Conflict detection: warn admin when two employees from the same team request overlapping dates

## Phase 4 — Insights (Future)

Target: Backlog

- Leave utilisation dashboard per department and leave type
- Year-end carry-over processing automation
- Integration with public holiday calendar module
- Leave request analytics: average approval time, decline rate by type

## Known Risks

- Bulk approve may conflict with backend rate limits if not batched correctly — coordinate with backend team.
- Carry-over processing logic must be backend-authoritative; frontend only displays the result.
