---
section: architecture
topic: non-functional-requirements
---

# User Payslip — Non-Functional Requirements

## Performance

| Metric                    | Target                             |
| ------------------------- | ---------------------------------- |
| Payslip list initial load | < 1.5s (p95)                       |
| Detail modal open         | < 500ms (detail fetched on demand) |
| PDF download initiation   | < 5s (p95)                         |
| Skeleton shown within     | < 100ms of navigation              |

## Accessibility

- All interactive elements keyboard-navigable (Tab, Enter, Escape).
- Modal traps focus while open; focus returns to trigger on close.
- Status badges use colour + text (not colour alone).
- PDF download button announces state via `aria-busy` during download.
- WCAG 2.1 AA minimum.

## Security

- No payslip data stored in localStorage or sessionStorage.
- Blob URL created for download is revoked immediately after click.
- All API calls carry the Bearer token from the session — no manual token handling in this module.
- Backend enforces `employeeId` scoping via JWT; frontend never sends `employeeId` explicitly.

## Reliability

- TanStack Query retries failed list/detail fetches up to 2 times before showing error state.
- Download errors surface as a toast — never a full-page error.
- Empty state rendered when list returns `data: []`.

## Scalability

- List endpoint must support pagination; UI renders pages lazily.
- Payslip detail is fetched on demand (not preloaded) to avoid over-fetching for large tenures.
