---
section: architecture
topic: non-functional-requirements
---

# Onboarding — Non-Functional Requirements

## Performance

| Metric                      | Target                      |
| --------------------------- | --------------------------- |
| Step page initial load      | < 1.5s                      |
| Company profile save        | < 1s (PATCH is lightweight) |
| Team creation               | < 800ms                     |
| Employee invitation (batch) | < 2s for up to 20 employees |
| Tour initialization         | < 500ms                     |

## Usability

- Progress indicator visible on all steps (breadcrumb or step counter).
- "Back" navigation preserves any unsaved form input via form state or URL params.
- Accordion panels auto-open after a team/employee is created to confirm success.
- Empty states for teams and employees list include a clear CTA to add the first item.

## Accessibility

- Wizard steps are labelled with `aria-current="step"` on the active breadcrumb item.
- Accordion panels use `<details>/<summary>` or ARIA `aria-expanded`/`aria-controls`.
- All form fields have associated `<label>` elements.
- Error messages use `role="alert"`.
- WCAG 2.1 AA minimum.

## Reliability

- Each step save is atomic — if a team creation fails, the UI shows the error without losing other teams already created.
- Employee invite failures are shown per-employee if the backend supports per-item errors (batch response).
- TanStack Query mutations retry 0 times — errors surface immediately.

## Security

- Onboarding routes require a valid session — `proxy.ts` enforces this.
- The owner cannot access other companies' data — all API calls are company-scoped via JWT.
- Employee passwords set during onboarding are never stored client-side beyond the form field.
