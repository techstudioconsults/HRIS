# User Home — Accessibility Audit

_Accessibility requirements and audit checklist for the employee home dashboard._

## Standards

- WCAG 2.1 Level AA compliance required.
- Automated audits run with axe-core via `@axe-core/react` or Playwright axe integration.

## Checklist

### Keyboard Navigation

- [ ] All quick-action card buttons are reachable via `Tab` key
- [ ] Setup task buttons are reachable via `Tab` key; locked buttons are skipped or show a disabled state
- [ ] No keyboard traps anywhere on the page

### Screen Reader Support

- [ ] Activity feed list has `role="list"` and each item has `role="listitem"`
- [ ] Quick-action cards have descriptive `aria-label` attributes on their buttons
- [ ] Onboarding progress header announces `completedSteps / totalSteps` to screen readers
- [ ] Setup task status (pending/completed/locked) is conveyed via `aria-label` or visually-hidden text, not colour alone

### Colour and Contrast

- [ ] All body text meets 4.5:1 contrast ratio against its background
- [ ] Activity type icons have accompanying text labels (colour is not the sole indicator)
- [ ] Focus indicators are visible on all interactive elements

### Semantic HTML

- [ ] Page uses a proper `<main>` landmark
- [ ] Section headings follow a logical `h1 → h2 → h3` hierarchy
- [ ] Interactive elements are `<button>` or `<a>` — no `div` click handlers

## Automated Test Command

```bash
# To be added when axe integration is configured
pnpm test:a11y --filter=user-dashboard
```
