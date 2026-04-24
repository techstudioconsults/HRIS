---
section: architecture
topic: non-functional-requirements
---

# Admin Teams — Non-Functional Requirements

## Performance

- Team list page load (including first 20 teams): < 1.5s on a stable connection.
- Export blob download initiation: < 10s for up to 500 team members.
- Dialog open/close animations: < 200ms.

## Security

- All team mutations require `ADMIN` permission — enforced at middleware (`proxy.ts`) and backend.
- `organisationId` scoping enforced by JWT on backend; frontend never passes `organisationId` as a query param.
- Custom permissions array is validated server-side — frontend sends the array, backend enforces allowed values.

## Reliability

- Team list query retries once on network failure before showing error state.
- Export failure shows a toast with retry option — no silent failure.

## Accessibility

- All dialogs trap focus and restore on close.
- Permission checkboxes are grouped with `<fieldset>` and `<legend>`.
- Table rows have accessible row headers for employee name.
- Export button has `aria-label` distinguishing it from other download buttons on the page.

## Maintainability

- Max team size (50) and role limits (20) are read from `teamConfig` — not hardcoded in components.
- Default roles come from `teamRoleConfig.defaultRoles` — configurable without code changes.
