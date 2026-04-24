# User Leave — Accessibility Audit

## Standard

WCAG 2.1 Level AA

## Checklist

### Leave Page (`/user/leave`)

- [ ] Page has a descriptive `<h1>` heading
- [ ] "Request Leave" button has a clear accessible label
- [ ] Search input has a visible label or `aria-label`
- [ ] Leave balance section heading is present for screen reader navigation
- [ ] Empty state text is in the DOM and readable (not hidden from AT)

### Leave Cards (Request History List)

- [ ] Each card is a landmark or has semantic structure (not a generic `<div>` soup)
- [ ] Status badges use text label + colour — not colour alone (WCAG 1.4.1)
- [ ] "View Details" action has an accessible label that includes context (e.g., "View details for Annual Leave, 14–18 Jul 2025")
- [ ] Card list is announced correctly to screen readers (role="list" or `<ul>/<li>`)

### Request Leave Modal

- [ ] Dialog uses `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to the title
- [ ] Focus moves into the dialog on open; returns to "Request Leave" button on close
- [ ] Leave type selector has a visible `<label>` linked via `htmlFor`
- [ ] Date pickers expose `aria-label` on the input fields (start date, end date)
- [ ] Reason textarea has a visible label
- [ ] Validation errors are linked to inputs via `aria-describedby`
- [ ] Error messages announced via `aria-live` region on form submit

### Leave Details Modal

- [ ] Dialog `aria-labelledby` points to the modal title
- [ ] Rejection reason section is visually and semantically distinct
- [ ] "Edit" button accessible label includes request context
- [ ] Focus trapped within modal while open

### Submission Confirmation Modal

- [ ] Dialog `aria-labelledby` points to the success heading
- [ ] Success message is announced via `aria-live="assertive"` or modal focus
- [ ] "Close" button is the initial focus target

## Automated Audit

Run `@axe-core/playwright` on `/user/leave` and with each modal open.
Zero critical or serious violations required before any release.
