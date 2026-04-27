# Onboarding — Data Exposure Analysis

## Data Classification

| Data Element                 | Classification      | Where Displayed                   | Where Stored                                        |
| ---------------------------- | ------------------- | --------------------------------- | --------------------------------------------------- |
| Company name                 | Internal            | Step 1 form, breadcrumb           | PATCH body, API response (in-memory)                |
| Company address              | Internal            | Step 1 form                       | PATCH body only; not cached client-side             |
| Team names                   | Internal            | Step 2 accordion                  | Local React state + TanStack Query cache            |
| Role permissions             | Internal            | Step 2 role form                  | Local React state + TanStack Query cache            |
| Employee emails              | Confidential        | Step 3 form                       | PATCH body only                                     |
| Employee passwords (initial) | Highly Confidential | Step 3 password field             | Form state only; transmitted over TLS; never logged |
| Employee phone numbers       | Confidential        | Step 3 form                       | Form state only                                     |
| Setup status flags           | Internal            | Not displayed (route guard logic) | TanStack Query cache (in-memory)                    |

## Persistence Boundaries

- **TanStack Query cache** — in-memory; cleared on page close.
- **localStorage / sessionStorage** — no onboarding data is written here.
- **URL** — no sensitive data in query params. Step navigation uses route paths only.

## Exposure Risks and Mitigations

| Risk                                              | Mitigation                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------ |
| Employee initial passwords visible during typing  | `type="password"` field; visibility toggle follows auth pattern          |
| Employee passwords in browser history             | Never in URL; HTTP POST body only                                        |
| Other companies' data visible                     | Backend enforces company JWT scoping — cross-company access returns 403  |
| Onboarding accessible after completion            | `proxy.ts` redirects completed users; `takenTour` flag is the gate       |
| Batch employee invite leaks partial data on error | Error response should only reference field paths, not full employee data |
