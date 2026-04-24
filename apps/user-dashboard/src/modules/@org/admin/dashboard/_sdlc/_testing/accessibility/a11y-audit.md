# Admin Dashboard — Accessibility Audit

_WCAG 2.1 AA compliance requirements and audit checklist for the admin dashboard._

## Target Standard

WCAG 2.1 Level AA — mandatory for all dashboard components.

## Automated Audit Tool

- **axe-core** via `@axe-core/playwright` for E2E scans
- **eslint-plugin-jsx-a11y** for static analysis during development
- **Storybook a11y addon** for component-level checks (if Storybook is adopted)

## Audit Checklist

### Perceivable

- [ ] All metric values have descriptive `aria-label` attributes (e.g., "Total employees: 142")
- [ ] Colour is not the sole indicator of status — badges use both colour and text/icon
- [ ] Skeleton loaders include `aria-busy="true"` and descriptive `aria-label`
- [ ] All images and icons that convey meaning have `alt` text; decorative icons have `aria-hidden="true"`
- [ ] Text contrast ratio meets 4.5:1 minimum (AA) for all body text, 3:1 for large text

### Operable

- [ ] All interactive elements (retry buttons, navigation links) are focusable with Tab key
- [ ] Focus order follows the visual reading order (top-left to bottom-right)
- [ ] No keyboard traps anywhere in the dashboard
- [ ] Focus indicator is clearly visible (minimum 3:1 contrast ratio)

### Understandable

- [ ] Error messages are descriptive and suggest corrective action
- [ ] Tooltips and contextual labels are provided for abbreviated metric labels
- [ ] The page has a descriptive `<title>` element

### Robust

- [ ] All widgets are compatible with VoiceOver (macOS/iOS) and NVDA (Windows)
- [ ] Live regions (`aria-live="polite"`) are used for dynamically updated counts (pending actions)
- [ ] No accessibility violations reported by axe-core automated scan

## Audit Log

| Date | Tool     | Result      | Issues Found | Resolved |
| ---- | -------- | ----------- | ------------ | -------- |
| TODO | axe-core | Not yet run | —            | —        |
