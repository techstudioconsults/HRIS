# Admin Employee Module — Non-Functional Requirements

## Performance

| Requirement                      | Target                                                                      |
| -------------------------------- | --------------------------------------------------------------------------- |
| Employee list initial load       | < 3 seconds (P95)                                                           |
| Employee profile load (all tabs) | < 4 seconds (P95)                                                           |
| Form submission (create/edit)    | < 5 seconds (P95)                                                           |
| Status change (optimistic)       | Instant UI update; API confirms within 2 seconds                            |
| Document upload (10 MB max)      | Progress indicator shown; completes within 30 seconds on standard broadband |
| Search debounce                  | 300 ms — no request fired per keystroke                                     |

## Scalability

- The list view must remain usable (no UI degradation) at 5,000 employees with server-side pagination.
- TanStack Query `staleTime: 3min` on the list reduces redundant requests for power users who frequently switch between views.

## Reliability

- List and profile load failures must show a non-blocking error state with Retry — the page must not crash.
- Optimistic status change rollback must always restore the last known good state without a page reload.
- Document upload must be resumable on network interruption (backend responsibility); frontend shows last progress on retry.

## Accessibility

- All interactive elements (table rows, action menus, form fields) must be keyboard navigable.
- Status badges must convey status via text label, not colour alone (WCAG 1.4.1).
- Form field errors must be announced via `aria-describedby` linking the field to its error message.
- Focus must be trapped in modal dialogs (status change confirmation).
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (WCAG 2.1 AA).

## Security

- All routes require `ADMIN` or `HR_MANAGER` permission — enforced in `proxy.ts`.
- PII fields (NIN, BVN, DOB) are never included in list responses.
- Document signed URLs expire after 15 minutes.
- Audit trail is append-only — no delete or edit of audit entries.

## Observability

- All API errors in this module are logged with `employeeId` context via the structured logger.
- Form submission failures emit a structured event for monitoring.
- Long-running document uploads (> 10 seconds) emit a warning log.

## Browser Support

Consistent with the monorepo baseline: latest two versions of Chrome, Firefox, Safari, Edge.
