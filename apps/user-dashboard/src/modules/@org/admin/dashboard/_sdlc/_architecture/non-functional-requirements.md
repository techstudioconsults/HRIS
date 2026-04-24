# Admin Dashboard — Non-Functional Requirements

_Performance, accessibility, reliability, and security requirements for the dashboard module._

## Performance

| Requirement                            | Target                    | Measurement                     |
| -------------------------------------- | ------------------------- | ------------------------------- |
| Time to First Contentful Paint (FCP)   | < 1.5s on 4G              | Lighthouse / Core Web Vitals    |
| Time to first widget data rendered     | < 3s from page load       | TanStack Query + network timing |
| Bundle size contribution (this module) | < 50 KB gzipped           | `next build` output             |
| Re-render frequency                    | No unnecessary re-renders | React DevTools Profiler         |

## Accessibility

- All widgets must achieve WCAG 2.1 AA compliance.
- Metric values must be wrapped in appropriate ARIA roles (e.g., `role="status"` for live updates).
- Skeleton loaders must include `aria-busy="true"` while loading.
- Colour is never the sole indicator of status — use icons + text labels alongside colour.
- Full keyboard navigation must be possible without a mouse.

## Reliability

- Dashboard must degrade gracefully: if one widget's API fails, all other widgets continue to render.
- No single API failure should result in a blank page or unhandled exception visible to the user.
- TanStack Query retry policy: 1 automatic retry on network error before showing error state.

## Security

- Dashboard endpoints must require a valid JWT; 401 responses redirect to the login page.
- No PII (employee names, salaries, national IDs) is rendered on the dashboard surface — only aggregated counts and percentages.
- See `_sdlc/_security/` for full RBAC and data-exposure documentation.

## Internationalisation

- All user-facing labels must use i18n translation keys — no hardcoded English strings in component logic.
- Number formatting must respect the organisation's locale setting.
- Date formatting (payroll run dates, activity timestamps) must use the organisation's configured timezone.
