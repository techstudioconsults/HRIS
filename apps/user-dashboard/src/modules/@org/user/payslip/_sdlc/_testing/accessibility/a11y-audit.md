---
section: testing
topic: accessibility-audit
---

# User Payslip — Accessibility Audit

## Standard

WCAG 2.1 Level AA

## Audit Checklist

### Payslip List Page

| Check                               | Criterion                    | Expected                                             | Status      |
| ----------------------------------- | ---------------------------- | ---------------------------------------------------- | ----------- |
| Payslip grid is keyboard navigable  | 2.1.1 Keyboard               | Tab reaches each "View" button in sequence           | ☐ To verify |
| Summary card has meaningful label   | 1.3.1 Info and Relationships | `aria-label="Latest net pay"`                        | ☐ To verify |
| Status badge legible without colour | 1.4.1 Use of Colour          | Badge text "FINALIZED" visible independent of colour | ☐ To verify |
| Loading skeleton announced          | 4.1.3 Status Messages        | `aria-busy="true"` on loading container              | ☐ To verify |
| Empty state announced               | 1.3.1                        | Empty state paragraph reachable by SR                | ☐ To verify |

### Payslip Details Modal

| Check                                             | Criterion                          | Expected                                                 | Status      |
| ------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- | ----------- |
| Modal has `role="dialog"` and `aria-modal="true"` | 4.1.2 Name, Role, Value            | Present on modal root                                    | ☐ To verify |
| Focus trapped inside modal                        | 2.1.2 No Keyboard Trap (corrected) | Tab cycles within modal; does not reach page behind      | ☐ To verify |
| Focus returns to trigger on close                 | 2.4.3 Focus Order                  | Focus returns to the "View" button that opened the modal | ☐ To verify |
| Escape closes modal                               | 2.1.1 Keyboard                     | `keydown` Escape handler fires `onClose`                 | ☐ To verify |
| Modal announced on open                           | 4.1.3 Status Messages              | SR announces dialog role + label                         | ☐ To verify |
| Breakdown tables have accessible headers          | 1.3.1                              | `<th>` for Label and Amount columns                      | ☐ To verify |

### Download Button

| Check                            | Criterion                 | Expected                                  | Status      |
| -------------------------------- | ------------------------- | ----------------------------------------- | ----------- |
| `aria-busy` during download      | 4.1.3 Status Messages     | `aria-busy="true"` while blob is fetching | ☐ To verify |
| Button label is descriptive      | 2.4.6 Headings and Labels | "Download PDF" — not just "Download"      | ☐ To verify |
| Spinner has `aria-hidden="true"` | 1.1.1 Non-text Content    | Visual spinner does not confuse SR        | ☐ To verify |

## Automated Audit

Run with `@axe-core/playwright` on E2E tests:

```typescript
import { checkA11y } from 'axe-playwright';

test('no axe violations on payslip page', async ({ page }) => {
  await page.goto('/user/payslip');
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

## Known Exceptions

None at time of writing. If exceptions are added, document the WCAG criterion, the element, and the accepted risk.
