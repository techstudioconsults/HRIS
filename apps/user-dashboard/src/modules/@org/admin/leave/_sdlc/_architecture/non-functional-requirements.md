# Leave Management — Non-Functional Requirements

_Quality attributes and constraints the leave module must satisfy beyond functional behaviour._

## Performance

- **Initial page load**: Time-to-Interactive must be under 2 seconds on a standard 4G connection (measured via Lighthouse).
- **Pagination fetch**: Subsequent page fetches must complete within 500ms under normal load.
- **Filter interaction**: Filter state changes should trigger a re-render within one animation frame — no perceptible lag. TanStack Query `staleTime: 30_000` prevents redundant re-fetches on rapid filter cycling.
- **Table size**: The table must handle display of up to 500 rows per page without degradation (though default page size is 20).

## Accessibility

- All interactive elements (approve button, decline form, filter selects, pagination) must be keyboard navigable.
- Status badges must not rely solely on colour — include accessible text or an ARIA label.
- Drawer focus must be trapped while open (`aria-modal`); focus returns to the trigger element on close.
- Screen reader announcements for live status changes (approval toast, page change).

## Security

- Leave request data must only be visible to users with the `LEAVE_ADMIN` or `LEAVE_VIEWER` role — enforced by route middleware, not component-level checks.
- The approve/decline action buttons must be disabled (not just hidden) for users with `LEAVE_VIEWER` role.
- Employee personal data displayed in request details (name, department) follows the minimum-necessary principle; no medical diagnosis or sensitive sick-leave notes are exposed.

## Reliability

- All TanStack Query hooks must define an `onError` handler — no silent failures.
- The leave requests table must degrade gracefully if the API is unreachable: show an error banner, keep the filter controls functional, and offer a retry button.
- Wizard state in Zustand is session-persistent (not persisted to `localStorage`) — acceptable to lose on page refresh given the wizard is a one-time setup flow.

## Internationalisation

- All user-visible strings must be passed through the i18n translation function from day one, even if only English translations exist initially.
- Date formatting must use the organisation's configured locale, not the browser's default.
- Leave allowance display must support both "days" (English) and future localised equivalents.

## Maintainability

- Module must remain under 300 lines per file; split components when exceeded.
- All new hooks must have unit tests covering the happy path and at least one error path.
- No direct `fetch` or `axios` calls — always route through `HttpAdapter`.
