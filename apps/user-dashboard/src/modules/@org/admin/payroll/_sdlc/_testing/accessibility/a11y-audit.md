---
section: testing
topic: accessibility
standard: WCAG 2.1 AA
---

# Admin Payroll — Accessibility Audit

## Automated Checks (axe-core)

Run via Playwright on each key screen:

```ts
import AxeBuilder from '@axe-core/playwright';

test('payroll overview has no critical a11y violations', async ({ page }) => {
  await page.goto('/admin/payroll');
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === 'critical')
  ).toHaveLength(0);
});
```

Screens to audit: Overview, Setup Wizard, Run Review, Roster, Payslip modal, Fund Wallet modal, Adjustment drawer.

## Manual Checklist

### 1.1 — Text Alternatives

- [ ] Wallet balance card icon has `aria-hidden="true"` and accompanying visible text.
- [ ] Progress bar has `aria-label="Payroll run progress"` with `aria-valuenow` updated by SSE.
- [ ] Payslip modal close button has `aria-label="Close payslip"`.

### 1.3 — Adaptable

- [ ] Roster table uses `<table>` with `<th scope="col">` for all column headers.
- [ ] Payslip modal uses `role="dialog"` and `aria-labelledby` pointing to the modal heading.
- [ ] Insufficient balance dialog uses `role="alertdialog"` and `aria-describedby` for the shortfall message.

### 1.4 — Distinguishable

- [ ] Run status badges use text label + colour — not colour alone (WCAG 1.4.1).
- [ ] Financial figures in the roster table have ≥ 4.5:1 contrast ratio against background.
- [ ] `font-mono` is used for Naira amounts but does not reduce text size below 12px.

### 2.1 — Keyboard Accessible

- [ ] Adjustment drawer can be opened and dismissed with keyboard only.
- [ ] Fund wallet modal can be completed (enter amount, submit) without a mouse.
- [ ] All table rows with click handlers have `role="button"` and respond to Enter/Space.
- [ ] Wizard `Next` / `Back` buttons are reachable via Tab and activatable via Enter.

### 2.4 — Navigable

- [ ] Page has a visible `<h1>` on every route (`/admin/payroll`, `/admin/payroll/setup`).
- [ ] Modal focus is trapped while open; focus returns to trigger element on close.
- [ ] Skip link present to bypass navigation and jump to payroll content.

### 3.3 — Input Assistance

- [ ] All form inputs (`PayrollSetupWizard`, `AdjustmentDrawer`, `FundWalletModal`) have associated `<label>` elements.
- [ ] Inline error messages are associated to their input via `aria-describedby`.
- [ ] `EXCEEDS_GROSS` error is announced by screen reader when backend returns 422.

### 4.1 — Compatible

- [ ] No duplicate `id` attributes in dynamically rendered roster rows.
- [ ] Progress bar live region announced by screen readers when progress updates.
- [ ] `aria-live="polite"` used for non-critical status updates (toasts); `aria-live="assertive"` reserved for errors only.
