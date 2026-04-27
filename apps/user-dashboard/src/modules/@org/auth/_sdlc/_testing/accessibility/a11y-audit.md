---
section: testing
topic: accessibility-audit
---

# Auth — Accessibility Audit

## Standard

WCAG 2.1 Level AA

## Login Page (`/login`)

| Check                        | Criterion                    | Expected                                                         | Status      |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------------- | ----------- |
| Form fields have labels      | 1.3.1                        | `<label>` associated with each input                             | ☐ To verify |
| Email field type             | 1.3.5 Identify Input Purpose | `type="email"` + `autocomplete="email"`                          | ☐ To verify |
| Password field type          | 1.3.5                        | `type="password"` + `autocomplete="current-password"`            | ☐ To verify |
| Password visibility toggle   | 1.1.1 + 2.4.6                | `aria-label="Show password"` / `"Hide password"` — not icon-only | ☐ To verify |
| Form errors announced        | 4.1.3 Status Messages        | `role="alert"` or `aria-live="polite"` on error container        | ☐ To verify |
| Submit button disabled state | 4.1.2                        | `aria-disabled="true"` or `disabled` during pending              | ☐ To verify |
| Keyboard-only navigation     | 2.1.1                        | Tab order: email → password → forgot link → submit → OTP link    | ☐ To verify |
| No colour-only errors        | 1.4.1                        | Error text accompanies red border                                | ☐ To verify |

## OTP Input (`/login/otp-verify`)

| Check                        | Criterion | Expected                               | Status      |
| ---------------------------- | --------- | -------------------------------------- | ----------- |
| Each digit has a label       | 1.3.1     | `aria-label="Digit 1"` etc.            | ☐ To verify |
| Auto-advance announced       | 4.1.3     | SR does not announce jumps confusingly | ☐ To verify |
| Paste fills all digits       | 2.1.1     | Single paste fills all 6 fields        | ☐ To verify |
| Resend button disabled state | 4.1.2     | `aria-disabled` + countdown label      | ☐ To verify |

## Register Page (`/register`)

| Check                           | Criterion | Expected                                             | Status      |
| ------------------------------- | --------- | ---------------------------------------------------- | ----------- |
| All fields labelled             | 1.3.1     | Each input has `<label>`                             | ☐ To verify |
| Password requirements visible   | 1.3.3     | Not communicated by colour alone                     | ☐ To verify |
| Confirm password mismatch error | 4.1.3     | Error announced on field blur                        | ☐ To verify |
| autocomplete attributes         | 1.3.5     | `given-name`, `family-name`, `email`, `new-password` | ☐ To verify |

## Automated Audit

```typescript
import { checkA11y } from 'axe-playwright';

test('no axe violations on login page', async ({ page }) => {
  await page.goto('/login');
  await checkA11y(page);
});

test('no axe violations on register page', async ({ page }) => {
  await page.goto('/register');
  await checkA11y(page);
});
```

## Known Exceptions

None at time of writing.
