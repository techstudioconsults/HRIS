# Leave Management — Accessibility Audit

_Accessibility requirements and audit results for the admin leave management module._

## Standards Target

WCAG 2.1 Level AA compliance across all leave management screens.

## Audit Checklist

### Leave Request Table

- [ ] Table has a visible `<caption>` or `aria-label` describing its content
- [ ] Column headers use `<th scope="col">`
- [ ] Status badges include visually hidden text (e.g. `<span class="sr-only">Status:</span>`) so screen readers read "Status: Pending" not just "Pending"
- [ ] Clickable rows have `role="button"` and `tabIndex={0}` with keyboard (`Enter`/`Space`) support, or use `<a>` with appropriate href
- [ ] Sort controls announce current sort state via `aria-sort`

### Leave Request Detail Drawer

- [ ] Drawer uses `role="dialog"` and `aria-modal="true"`
- [ ] Drawer has a descriptive `aria-labelledby` pointing to its heading
- [ ] Focus is moved to the first focusable element inside the drawer when it opens
- [ ] Focus trap is active while the drawer is open (Tab/Shift+Tab cycles within)
- [ ] Close button returns focus to the row that triggered the drawer
- [ ] Approve button has `aria-disabled="true"` when user lacks LEAVE_ADMIN role

### Leave Type Form Drawer

- [ ] All form fields have associated `<label>` elements
- [ ] Error messages use `aria-describedby` on the input to associate the error text
- [ ] Required fields are indicated by `aria-required="true"` and visible label marker
- [ ] Success/error toasts use `role="status"` or `role="alert"` for screen reader announcement

### Setup Wizard

- [ ] Step indicator communicates current step to screen readers (`aria-current="step"`)
- [ ] Progress announcement on step advance (live region or focus move)
- [ ] Navigation buttons clearly labelled: "Next: Configure Policy" not just "Next"

### Filter Controls

- [ ] All `<select>` elements have associated `<label>`
- [ ] Date range picker is keyboard accessible
- [ ] "Clear filters" button has a descriptive `aria-label`

## Known Issues

- TODO: Document discovered issues after first axe-core audit run
- TODO: Verify colour contrast ratios for status badge variants (amber, green, red on white background)

## Tools

- `@axe-core/playwright` — automated scan during E2E suite
- Storybook a11y addon — component-level scan during development
- Manual keyboard walkthrough — required before each release
