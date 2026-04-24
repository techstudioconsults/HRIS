# Settings Module — Accessibility Audit

## Standard

WCAG 2.1 Level AA

## Checklist

### Tab Navigation Shell

- [ ] Tab list uses `role="tablist"` with `aria-label="Settings"`
- [ ] Each tab uses `role="tab"` with `aria-selected` and `aria-controls` pointing to its panel
- [ ] Tab panels use `role="tabpanel"` with `aria-labelledby` linking to the active tab
- [ ] Keyboard: `Tab` moves between tabs; `Enter`/`Space` activates; `Arrow` moves within tablist

### All Settings Forms

- [ ] Every field has a `<label>` linked via `htmlFor` / `id`
- [ ] Required fields marked with `aria-required="true"`
- [ ] Validation errors linked to inputs via `aria-describedby`
- [ ] Save button shows loading text for screen readers (not spinner-only)
- [ ] Success and error toasts announced via `aria-live="polite"`

### Account Settings Tab

- [ ] Logo upload input has accessible label
- [ ] Logo preview has descriptive `alt` text
- [ ] File size/type errors are in the DOM and linked to the upload input

### Security Settings Tab

- [ ] 2FA toggle uses `role="switch"` with `aria-checked`
- [ ] Session timeout input has visible label and unit hint ("minutes")
- [ ] Password policy checkboxes are grouped with `<fieldset>` + `<legend>`

### Notification Settings Tab

- [ ] Each notification row toggle uses `role="switch"` with `aria-checked`
- [ ] Each toggle has a meaningful accessible label (not just "on/off")
- [ ] Event type label is associated with both the email and in-app toggles

### Roles Management Tab

- [ ] Roles list is a `<table>` or `role="list"` with proper semantics
- [ ] System role rows visually and programmatically indicate read-only status
- [ ] Delete button `aria-label` includes role name (e.g., "Delete Recruitment Lead")
- [ ] Role editor drawer uses `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- [ ] Focus moves into drawer on open; returns to Create Role button on close
- [ ] Permission checkboxes grouped with `<fieldset>` per domain

## Automated Audit

Run `@axe-core/playwright` on all six tab URLs:

- `/admin/settings?tab=account`
- `/admin/settings?tab=payroll`
- `/admin/settings?tab=security`
- `/admin/settings?tab=hr`
- `/admin/settings?tab=notifications`
- `/admin/settings?tab=roles`

Zero critical or serious violations required before any release.
