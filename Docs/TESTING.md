# Testing Guide

This document provides comprehensive guidance on running tests, writing tests, and understanding the testing infrastructure for the HRIS mono-repo.

## Overview

The testing setup uses:

- **Vitest** for unit and component tests
- **Playwright** for end-to-end (E2E) tests
- **React Testing Library** for component testing
- **@workspace/test-utils** for shared test utilities and configuration

## Directory Structure

```
packages/
├── ui/
│   └── __tests__/
│       ├── unit/           # Unit tests
│       ├── components/     # Component tests
│       └── integration/    # Integration tests
└── test-utils/
    └── src/
        ├── index.ts        # Main exports
        ├── setup.ts        # Test setup
        ├── fixtures.ts     # Test data
        └── mocks.ts        # Mock utilities

apps/
├── user-dashboard/
│   ├── __tests__/
│   │   ├── unit/
│   │   └── components/
│   └── e2e/                # E2E tests
└── web/
    ├── __tests__/
    │   └── unit/
    └── e2e/                # E2E tests
```

## Running Tests

### Unit & Component Tests (Vitest)

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-reload on file changes)
pnpm test:watch

# Run tests with UI dashboard
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Run tests in specific package
pnpm test --filter=@workspace/ui
pnpm test --filter=user-dashboard
```

### E2E Tests (Playwright)

```bash
# Run E2E tests in headless mode
pnpm test:e2e

# Run E2E tests with UI (helpful for debugging)
pnpm test:e2e:ui

# Run specific E2E test file
pnpm exec playwright test apps/user-dashboard/e2e/home.e2e.spec.ts

# Debug mode (opens inspector)
pnpm exec playwright test --debug
```

### Filter by Package

```bash
# Run tests only for user-dashboard
turbo test --filter=user-dashboard

# Run tests only for web app
turbo test --filter=web

# Run tests for UI components
turbo test --filter=@workspace/ui
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from '@workspace/test-utils';

describe('calculateTotal', () => {
  it('should sum all numbers', () => {
    const result = calculateTotal([1, 2, 3]);
    expect(result).toBe(6);
  });

  it('should handle empty array', () => {
    const result = calculateTotal([]);
    expect(result).toBe(0);
  });
});
```

### Component Tests

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen, fireEvent } from '@workspace/test-utils';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Using Fixtures

```typescript
import { createMockUser, createMockAdmin } from '@workspace/test-utils/fixtures';

describe('UserCard', () => {
  it('should render user info', () => {
    const mockUser = createMockUser({ name: 'John Doe' });
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Using Mocks

```typescript
import { mockLocalStorage, resetMocks } from '@workspace/test-utils/mocks';

describe('LocalStorage Integration', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('should save user preferences', () => {
    savePreferences({ theme: 'dark' });

    expect(mockLocalStorage.getItem('preferences')).toBe('{"theme":"dark"}');
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('[type="email"]', 'user@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[type="email"]', 'user@example.com');
    await page.fill('[type="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

## Coverage Requirements

Coverage thresholds ensure code quality:

| Metric     | Packages | Apps |
| ---------- | -------- | ---- |
| Statements | 60%      | 40%  |
| Branches   | 60%      | 40%  |
| Functions  | 80%      | 40%  |
| Lines      | 60%      | 40%  |

To check coverage:

```bash
pnpm test:coverage
```

Coverage reports are generated in `coverage/` folder. Open `coverage/index.html` in browser for detailed view.

## Common Patterns

### Testing Async Operations

```typescript
it('should fetch data', async () => {
  render(<DataFetcher />);

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});
```

### Testing Error States

```typescript
it('should handle errors gracefully', async () => {
  // Mock fetch to reject
  global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

  render(<DataFetcher />);

  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### Testing Form Submissions

```typescript
it('should submit form', async () => {
  const mockSubmit = vi.fn();
  render(<Form onSubmit={mockSubmit} />);

  await userEvent.type(screen.getByLabelText('Name'), 'John');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(mockSubmit).toHaveBeenCalledWith({ name: 'John' });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Best Practices

1. **Test User Behavior**: Test what users see and do, not implementation details
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock External APIs**: Use fixtures and mocks for API calls, don't hit real endpoints
4. **Keep Tests Simple**: Each test should verify one behavior
5. **Use Descriptive Names**: Test names should clearly state what they test
6. **Avoid Test Interdependencies**: Tests should be independent and run in any order
7. **Clean Up After Tests**: Use `beforeEach` and `afterEach` for setup/teardown

## CI/CD Integration

Tests run automatically on pull requests. Configure via `.github/workflows/test.yml`:

```bash
# View CI logs
gh run list --repo=your-repo
```

## Troubleshooting

### Tests Fail Locally but Pass in CI

- Ensure you're using the same Node version (20+)
- Clear node_modules and reinstall: `pnpm install`
- Check environment variables in CI configuration

### E2E Tests Timeout

- Increase timeout: `test.setTimeout(60000)`
- Use `page.waitForLoadState('networkidle')`
- Check if dev server is running: `pnpm dev`

### Component Not Rendering in Tests

- Check if all required props are provided
- Ensure providers (Theme, Auth, etc.) are wrapped in test setup
- Add `{ wrapper: YourProvider }` to render options

### Mock Not Working

- Clear mocks in `beforeEach`: `vi.clearAllMocks()`
- Check mock is defined before rendering
- Verify import path matches actual module

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

1. Check example tests in `__tests__` and `e2e` folders
2. Review `@workspace/test-utils` documentation
3. Ask team members about test patterns used in project
4. Consult documentation links above
