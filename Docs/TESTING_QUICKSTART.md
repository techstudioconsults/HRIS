# Test Setup - Getting Started

This document helps you get started with the testing infrastructure in your first 5 minutes.

## Quick Start (5 mins)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Your First Test

```bash
# Run all tests
pnpm test

# Or run tests in watch mode (recommended during development)
pnpm test:watch
```

You should see green checkmarks ✓ for passing tests.

### 3. View Test UI (Interactive)

```bash
# Opens a browser-based test dashboard
pnpm test:ui
```

Great! You now have a working test setup. ✅

## Next Steps (10 mins)

### Write Your First Test

1. Create a new file: `packages/ui/__tests__/components/MyButton.test.tsx`

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';

// Your component (replace with real component)
const MyButton = ({ children }: { children: string }) => <button>{children}</button>;

describe('MyButton', () => {
  it('renders button with text', () => {
    render(<MyButton>Click me</MyButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

2. Run the test:

```bash
pnpm test:watch
```

Watch the test update in real-time as you edit! 🚀

## File Organization

### Where to Put Tests

```
packages/ui/
├── src/
│   └── components/
│       └── Button.tsx           # Your component
└── __tests__/
    ├── unit/                    # Logic tests
    ├── components/              # Component tests ← Most tests go here
    └── integration/             # Tests combining multiple parts

apps/user-dashboard/
├── src/                         # Application code
├── __tests__/                   # Unit & component tests
└── e2e/                         # End-to-end tests
```

### Test File Naming

Use `*.test.ts(x)` for all tests:

- ✅ `Button.test.tsx`
- ✅ `utils.test.ts`
- ✅ `integration.test.ts`

## Common Commands

```bash
# Development
pnpm test:watch          # Auto-run tests on file changes
pnpm test:ui            # Interactive dashboard

# CI/Automation
pnpm test               # Run once (for CI pipelines)
pnpm test:coverage      # Generate coverage report

# E2E Testing
pnpm test:e2e           # Run browser tests
pnpm test:e2e:ui        # Interactive browser test dashboard

# Filtering
turbo test --filter=user-dashboard        # Only test user-dashboard
turbo test --filter=@workspace/ui         # Only test UI package
```

## What's Configured

✅ **Vitest**: Unit and component testing  
✅ **Playwright**: End-to-end browser testing  
✅ **React Testing Library**: Component testing utilities  
✅ **Coverage Tracking**: Automatic coverage reports  
✅ **CI Integration**: GitHub Actions workflow  
✅ **VS Code Integration**: Run tests from editor

## Testing Checklist

When writing tests, follow this simple checklist:

- [ ] Test user behavior (what they see/do), not implementation
- [ ] Use semantic queries: `getByRole`, `getByLabelText`, `getByText`
- [ ] Each test checks one thing
- [ ] Descriptive test name (not "it works")
- [ ] No test interdependencies (can run in any order)

**Bad test:**

```typescript
it('works', () => {
  const { getByTestId } = render(<MyComponent />);
  expect(getByTestId('button-1')).toBeDefined();
});
```

**Good test:**

```typescript
it('shows submit button when form is not empty', () => {
  render(<Form />);
  const submitBtn = screen.getByRole('button', { name: /submit/i });
  expect(submitBtn).toBeInTheDocument();
});
```

## Troubleshooting

### Tests not running?

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Import errors in tests?

Make sure you're using correct imports:

```typescript
// ✅ Correct
import { render, screen, expect, describe, it } from '@workspace/test-utils';

// ❌ Wrong
import { render } from '@testing-library/react';
```

### Component not rendering?

Check if you need to wrap with providers:

```typescript
// Often components need context/theme providers
render(
  <ThemeProvider>
    <MyComponent />
  </ThemeProvider>
);
```

## Learn More

- 📚 Full guide: Read `TESTING.md`
- 📖 Vitest docs: https://vitest.dev
- 🎭 Playwright docs: https://playwright.dev
- 🧪 Testing Library: https://testing-library.com

## Need Help?

1. Check example tests in `__tests__` folders
2. Look at `TESTING.md` for patterns
3. Ask teammates about test practices
4. Check documentation links above

---

**You're all set!** Happy testing! 🎉

Next: Run `pnpm test:watch` and start writing tests.
