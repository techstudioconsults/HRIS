---
section: testing
topic: accessibility-audit
---

# Onboarding — Accessibility Audit

## Standard

WCAG 2.1 Level AA

## All Steps — Common Checks

| Check                        | Criterion | Expected                                                  | Status      |
| ---------------------------- | --------- | --------------------------------------------------------- | ----------- |
| Breadcrumb active step       | 4.1.2     | `aria-current="step"` on active breadcrumb item           | ☐ To verify |
| All form inputs labelled     | 1.3.1     | Every `<input>`, `<select>` has an associated `<label>`   | ☐ To verify |
| Error messages announced     | 4.1.3     | `role="alert"` or `aria-live="polite"` on error container | ☐ To verify |
| Submit button disabled state | 4.1.2     | `disabled` or `aria-disabled="true"` while pending        | ☐ To verify |
| Keyboard navigation          | 2.1.1     | Tab order follows visual layout                           | ☐ To verify |
| Focus visible                | 2.4.7     | Focus ring visible on all interactive elements            | ☐ To verify |

## Step 2 — Accordion (Teams & Roles)

| Check                 | Criterion | Expected                                              | Status      |
| --------------------- | --------- | ----------------------------------------------------- | ----------- |
| Accordion trigger     | 4.1.2     | `aria-expanded` on toggle button                      | ☐ To verify |
| Accordion panel       | 1.3.1     | `aria-controls` linking trigger to panel              | ☐ To verify |
| Delete button label   | 2.4.6     | `aria-label="Delete team [name]"` — not just "Delete" | ☐ To verify |
| Add role button label | 2.4.6     | `aria-label="Add role to [team name]"`                | ☐ To verify |

## Step 3 — Employee Form

| Check                           | Criterion | Expected                                    | Status      |
| ------------------------------- | --------- | ------------------------------------------- | ----------- |
| Team + Role select autocomplete | 1.3.5     | `autocomplete="off"` (dynamically filtered) | ☐ To verify |
| Password field                  | 1.3.5     | `autocomplete="new-password"`               | ☐ To verify |
| Remove employee button          | 2.4.6     | `aria-label="Remove employee [name]"`       | ☐ To verify |

## Automated Audit

```typescript
import { checkA11y } from 'axe-playwright';

for (const url of [
  '/onboarding/welcome',
  '/onboarding/step-1',
  '/onboarding/step-2',
  '/onboarding/step-3',
]) {
  test(`no axe violations on ${url}`, async ({ page }) => {
    await page.goto(url);
    await checkA11y(page);
  });
}
```

## Known Exceptions

None at time of writing.
