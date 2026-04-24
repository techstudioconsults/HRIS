---
section: testing
topic: accessibility
standard: WCAG 2.1 AA
---

# Admin Teams — Accessibility Audit

## Automated Checks (axe-core)

```ts
import AxeBuilder from '@axe-core/playwright';

test('teams list has no critical a11y violations', async ({ page }) => {
  await page.goto('/admin/teams');
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === 'critical')
  ).toHaveLength(0);
});
```

Screens to audit: Teams List, Team Details, Create Team Dialog, Create Role Dialog, Assign Employee Dialog, Delete Confirmation.

## Manual Checklist

### 1.1 — Text Alternatives

- [ ] Export button has `aria-label="Export team roster"` (not just icon).
- [ ] Action icons (edit/delete) in table rows have `aria-label` with team name included.

### 1.3 — Adaptable

- [ ] Teams table uses `<table>` with `<th scope="col">` for all column headers.
- [ ] Permission checkboxes are wrapped in `<fieldset>` with `<legend>Permissions</legend>`.
- [ ] All dialogs use `role="dialog"` and `aria-labelledby` pointing to the dialog heading.
- [ ] Delete confirmation uses `role="alertdialog"` with `aria-describedby`.

### 1.4 — Distinguishable

- [ ] Team and member status badges use text + colour (WCAG 1.4.1).
- [ ] All text has ≥ 4.5:1 contrast ratio against background.

### 2.1 — Keyboard Accessible

- [ ] Create, Edit, Delete actions reachable via keyboard.
- [ ] Workflow dialogs (Team → Role → Employee) completable by keyboard alone.
- [ ] Employee combobox search supports keyboard selection.
- [ ] Filter form completable by keyboard.

### 2.4 — Navigable

- [ ] Page has visible `<h1>` on `/admin/teams`.
- [ ] Modal focus is trapped while open; focus returns to trigger element on close.
- [ ] Skip link present to bypass navigation.

### 3.3 — Input Assistance

- [ ] All form inputs have associated `<label>`.
- [ ] Inline validation errors are announced by screen reader via `aria-describedby`.
- [ ] `TEAM_NAME_EXISTS` 409 error surfaced as visible + announced form error.

### 4.1 — Compatible

- [ ] No duplicate `id` attributes in dynamically rendered team rows.
- [ ] `aria-live="polite"` used for success toasts.
