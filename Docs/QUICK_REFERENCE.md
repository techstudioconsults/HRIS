# 🧪 Test Commands Quick Reference

Print this or bookmark it!

## Run Tests

```bash
# All tests, run once
pnpm test

# Watch mode (best for development)
pnpm test:watch

# Interactive dashboard
pnpm test:ui

# Coverage report
pnpm test:coverage
```

## E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Interactive E2E dashboard
pnpm test:e2e:ui

# Single test file
pnpm exec playwright test apps/user-dashboard/e2e/login.e2e.spec.ts

# Debug mode
pnpm exec playwright test --debug
```

## Filter by Package

```bash
# UI package only
turbo test --filter=@workspace/ui

# user-dashboard only
turbo test --filter=user-dashboard

# web app only
turbo test --filter=web
```

## View Results

```bash
# Open coverage report
open coverage/index.html

# Open E2E report
open playwright-report/index.html
```

## Debugging

```bash
# Run tests in debug mode
pnpm exec vitest --inspect-brk

# Playwright inspector
pnpm exec playwright test --debug

# Watch single file
pnpm test:watch apps/user-dashboard/__tests__/unit/example.test.ts
```

## CI/CD

```bash
# Test locally before pushing
pnpm test

# Run entire CI pipeline
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## File Templates

### Unit Test

```typescript
import { describe, it, expect } from '@workspace/test-utils';

describe('functionName', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Component Test

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('user can do something', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page).toHaveURL('/next-page');
});
```

## Imports

```typescript
// All utilities from one place
import { describe, it, test, expect, vi, render, screen, fireEvent, waitFor } from '@workspace/test-utils';

// Fixtures
import { createMockUser, createMockAdmin, mockLocalStorage, mockFetch } from '@workspace/test-utils/fixtures';
```

## Common Queries

```typescript
// By role (preferred)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('heading', { level: 1 });

// By label
screen.getByLabelText('Email');

// By text
screen.getByText('Welcome');

// By placeholder
screen.getByPlaceholderText('Search...');

// By test ID (last resort)
screen.getByTestId('custom-id');
```

## Common Assertions

```typescript
// Visibility
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();

// Text
expect(element).toHaveTextContent('Hello');
expect(element).toContainElement(child);

// Values
expect(input).toHaveValue('text');
expect(select).toHaveValue('option');

// Classes
expect(element).toHaveClass('active');

// Calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg);
```

## Coverage Requirements

| Metric     | Packages | Apps |
| ---------- | -------- | ---- |
| Statements | 60%      | 40%  |
| Branches   | 60%      | 40%  |
| Functions  | 80%      | 40%  |
| Lines      | 60%      | 40%  |

## Documentation

| Doc                        | Purpose                 |
| -------------------------- | ----------------------- |
| TEST_INFRASTRUCTURE.md     | Overview & architecture |
| TESTING_QUICKSTART.md      | 5-minute quick start    |
| TESTING.md                 | Complete reference      |
| TEST_EXAMPLES.md           | 30+ copy-paste examples |
| TEST_SETUP_SUMMARY.md      | What was set up         |
| TEST_SETUP_VERIFICATION.md | Verify everything works |

## Shortcuts

```bash
# Alias for watch mode
alias tw="pnpm test:watch"

# Run tests and show UI
alias tt="pnpm test:ui"

# Coverage
alias tc="pnpm test:coverage"
```

Add to your shell config (`.bashrc`, `.zshrc`, etc.)

## Need Help?

1. Quick question → `TESTING_QUICKSTART.md`
2. Need example → `TEST_EXAMPLES.md`
3. Detailed info → `TESTING.md`
4. Something broken → `TEST_SETUP_VERIFICATION.md`

---

**Save this file!** 📌

Print it or save to bookmarks for quick reference during development.

Happy testing! 🚀
