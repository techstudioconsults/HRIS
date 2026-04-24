# User Payslip — Data Exposure Analysis

## Data Classification

| Data Element         | Classification | Where Displayed                   | Where Stored                         |
| -------------------- | -------------- | --------------------------------- | ------------------------------------ |
| Employee name        | Internal       | Not shown (inferred from session) | Not stored client-side               |
| Net pay amount       | Confidential   | Summary card, grid cards, modal   | TanStack Query in-memory cache only  |
| Earnings breakdown   | Confidential   | Modal detail only                 | TanStack Query in-memory cache only  |
| Deductions breakdown | Confidential   | Modal detail only                 | TanStack Query in-memory cache only  |
| Gross pay            | Confidential   | Modal totals row                  | TanStack Query in-memory cache only  |
| Payslip PDF          | Confidential   | Download only (file)              | Not stored; blob revoked immediately |
| Payslip IDs          | Internal       | Never displayed                   | TanStack Query keys (in-memory)      |

## Persistence Boundaries

- **TanStack Query cache** — in-memory only; cleared on tab close or session end.
- **localStorage / sessionStorage** — payslip data is **never** written here.
- **Blob URLs** — created for PDF download and revoked synchronously after the `<a>.click()` call. No payslip content persists in memory beyond the click.
- **Network** — all API calls use TLS; the Bearer token is sent as an HTTP header (not a URL param).

## Exposure Risks and Mitigations

| Risk                                       | Mitigation                                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| IDOR — employee guesses another payslip ID | Backend returns `403` for any payslip not owned by the JWT subject                                  |
| Data leaks in browser cache                | Payslip detail is not preloaded; only fetched when modal opens. Cache is in-memory, not persistent. |
| PDF saved with identifiable metadata       | Filename uses `period` (e.g., `payslip-2025-06.pdf`) — no employee name or ID in the filename       |
| Session token in URL                       | Bearer token is always in the `Authorization` header, never in the URL                              |
| Clipboard exposure                         | No copy-to-clipboard functionality in this module                                                   |
