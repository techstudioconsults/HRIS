# User Home — Non-Functional Requirements

_Quality attributes and constraints that the home dashboard must satisfy._

## Performance

- Initial page load (server-rendered HTML) must be < 1.5 s on a standard 4G connection.
- No client-side data fetching on initial render at MVP; the page is fully server-rendered.
- Quick-action card navigation must feel instantaneous (client-side routing via `next/link`).

## Accessibility

- All interactive elements (quick-action buttons, setup task buttons) must be reachable via keyboard.
- ARIA roles applied to the activity feed list (`role="list"`) and individual items (`role="listitem"`).
- Color is not the sole indicator of activity type — icons and labels accompany color coding.
- Minimum contrast ratio: 4.5:1 for all text against backgrounds (WCAG 2.1 AA).

## Security

- The home page is protected by the Next.js middleware route guard; unauthenticated requests are redirected to `/auth/login`.
- No sensitive employee data (salary, personal ID) is rendered on the home dashboard.
- Activity messages must never include raw backend error messages or stack traces.

## Reliability

- The dashboard must render successfully even if the activity feed API is unavailable (graceful empty state).
- Setup task `locked` status prevents erroneous button actions — buttons for locked tasks must be disabled.

## Maintainability

- No business logic in view components; view components receive all data via props.
- `RECENT_ACTIVITIES` constant is clearly marked as a mock placeholder pending API integration.
