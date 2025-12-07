# Testing Setup

This directory contains test files for the monorepo.

## Structure

- `e2e/` - Playwright end-to-end tests
- `setup.ts` - Vitest global setup file
- `*.test.tsx` - Unit and integration tests (example files)

## Running Tests

### Unit Tests (Vitest)
```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Run tests with coverage report
```

### E2E Tests (Playwright)
```bash
pnpm test:e2e          # Run all e2e tests
pnpm test:e2e:ui       # Run e2e tests with UI
pnpm test:e2e:headed   # Run e2e tests in headed mode
pnpm test:e2e:debug    # Debug e2e tests
```

## Writing Tests

### Unit Tests
Create test files alongside your source code with `.test.ts` or `.spec.ts` extension:

```typescript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

### E2E Tests
Create test files in `tests/e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```
