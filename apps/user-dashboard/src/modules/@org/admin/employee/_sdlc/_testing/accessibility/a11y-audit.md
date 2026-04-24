# Admin Employee Module — Accessibility Audit

_Accessibility requirements and audit checklist for the employee management module._

## Standard

WCAG 2.1 Level AA

## Checklist

### Employee List

- [ ] Table uses semantic `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` elements
- [ ] Column headers are descriptive and not empty
- [ ] Each row's action menu button has an accessible label (e.g., `aria-label="Actions for Amara Okafor"`)
- [ ] Status badges use text label + colour (not colour alone) — WCAG 1.4.1
- [ ] Search input has a visible label or `aria-label`
- [ ] Filter dropdowns are keyboard navigable; selected option is announced
- [ ] Skeleton loading rows have `aria-busy="true"` on the table container
- [ ] Empty state text is not hidden from screen readers

### Add / Edit Employee Form

- [ ] Every form field has a `<label>` associated via `htmlFor` / `id`
- [ ] Required fields are marked with `aria-required="true"`
- [ ] Field validation errors are linked to inputs via `aria-describedby`
- [ ] Error messages are announced on submit (not just visually styled)
- [ ] Unsaved changes confirmation dialog traps focus when open
- [ ] Save button shows loading state text (not just spinner icon) for screen readers

### Employee Profile

- [ ] Profile tabs use `role="tablist"` / `role="tab"` / `role="tabpanel"` pattern
- [ ] Active tab is identified with `aria-selected="true"`
- [ ] Tab panels linked to tabs via `aria-controls` / `aria-labelledby`
- [ ] Each section has a visible heading (`<h2>` / `<h3>`) for navigation

### Status Change Dialog

- [ ] Dialog uses `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- [ ] Focus moves into the dialog on open; returns to trigger on close
- [ ] Destructive confirm button clearly labelled (e.g., "Confirm Termination")

### Document Upload

- [ ] File input has an accessible label
- [ ] Upload progress is announced via `aria-live="polite"`
- [ ] Error messages (file too large, wrong type) are in the DOM and associated with the input

## Automated Audit

Run `@axe-core/playwright` on:

- `/admin/employee` (list)
- `/admin/employee/new` (create form)
- `/admin/employee/[id]` (profile — each tab)

Zero critical or serious violations are a gate for any release.
