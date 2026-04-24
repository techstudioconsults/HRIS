---
section: domain
topic: events
---

# User Payslip — Domain Events

> This is a read-only module. There are no mutations and therefore no write-path domain events. The events listed here are UI state transitions and informational signals consumed within the frontend only.

## UI Events

| Event                        | Trigger                             | Consumer                            | Effect                                            |
| ---------------------------- | ----------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `payslip.list.loaded`        | List query resolves successfully    | `PayslipSummaryCard`, `PayslipGrid` | Renders data; summary card shows `data[0].netPay` |
| `payslip.list.empty`         | List query returns `data: []`       | `PayslipGrid`                       | Renders empty state component                     |
| `payslip.list.error`         | List query throws (non-401)         | `PayslipGrid`                       | Renders error toast                               |
| `payslip.detail.requested`   | User clicks "View" on a card        | `PayslipPage`                       | `setSelectedPayslipId(id)`                        |
| `payslip.detail.loaded`      | Detail query resolves               | `PayslipDetailsModal`               | Renders breakdown and totals                      |
| `payslip.detail.error`       | Detail query throws 404             | `PayslipDetailsModal`               | Toast "Payslip not found."; modal stays closed    |
| `payslip.modal.closed`       | User clicks Close or presses Escape | `PayslipPage`                       | `setSelectedPayslipId(null)`                      |
| `payslip.download.started`   | User clicks "Download PDF"          | `PayslipDownloadButton`             | Sets `aria-busy=true`, calls service              |
| `payslip.download.completed` | Blob received, `<a>` clicked        | `PayslipDownloadButton`             | Revokes URL, clears spinner                       |
| `payslip.download.error`     | Download call throws                | `PayslipDownloadButton`             | Toast "Something went wrong. Please try again."   |

## Upstream Events Consumed (from other contexts)

| Event                     | Source                    | How This Module Responds                                             |
| ------------------------- | ------------------------- | -------------------------------------------------------------------- |
| Session invalidated (401) | `HttpAdapter` interceptor | Triggers `signOut` + redirect — handled globally, not in this module |
