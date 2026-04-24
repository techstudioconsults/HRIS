---
section: product
topic: user-story
id: US-001
---

# US-001 — View Payslip History and Download

## Story

As an employee, I want to view my payslip history and download individual payslips so I can keep personal financial records.

## Acceptance Criteria

- [ ] On page load, `GET /payslips` is called with the authenticated employee's credentials.
- [ ] Summary card displays the `netPay` from the most recent payslip.
- [ ] Grid shows all payslips, most recent first, each showing: month label, net pay, status badge, and a "View" button.
- [ ] Clicking "View" opens the details modal with earnings breakdown, deductions breakdown, gross pay, total deductions, and net pay.
- [ ] Download button triggers `GET /payslips/:id/download` and initiates a PDF file download.
- [ ] Empty state is shown when no payslips exist yet.
- [ ] Loading skeleton shown during initial fetch.

## Error Cases

| Error            | UI Behaviour                                    |
| ---------------- | ----------------------------------------------- |
| `404` on payslip | Modal does not open; toast "Payslip not found." |
| `401`            | Interceptor signs out and redirects to login    |
| `500`            | Toast "Something went wrong. Please try again." |
