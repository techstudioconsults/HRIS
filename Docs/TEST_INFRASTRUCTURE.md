# 🧪 Test Infrastructure - Complete Setup

Professional, scalable test setup for HRIS mono-repo using **Vitest** and **Playwright** following industry best practices.

## 📚 Documentation Map

Start here based on your need:

| Document                                                     | Time   | Purpose                    |
| ------------------------------------------------------------ | ------ | -------------------------- |
| **[TESTING_QUICKSTART.md](TESTING_QUICKSTART.md)**           | 5 min  | Get started immediately    |
| **[TESTING.md](TESTING.md)**                                 | 30 min | Complete testing reference |
| **[TEST_EXAMPLES.md](TEST_EXAMPLES.md)**                     | 15 min | Copy-paste test patterns   |
| **[TEST_SETUP_VERIFICATION.md](TEST_SETUP_VERIFICATION.md)** | 10 min | Verify everything works    |
| **[TEST_SETUP_SUMMARY.md](TEST_SETUP_SUMMARY.md)**           | 10 min | See what was set up        |

## 🚀 Quick Start (60 seconds)

```bash
# 1. Install dependencies
pnpm install

# 2. Run tests
pnpm test

# 3. Watch mode (recommended for development)
pnpm test:watch

# 4. Interactive dashboard
pnpm test:ui
```

All example tests should pass ✅

## 🏗️ Architecture

### Testing Levels

```
┌─────────────────────────────────────────┐
│          E2E Tests (Playwright)         │
│     Test complete user workflows        │
│    (login, forms, navigation, etc)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Component Tests (React Testing Lib)   │
│    Test components in isolation         │
│     (buttons, forms, cards, etc)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Unit Tests (Vitest)                 │
│     Test functions and logic            │
│   (utils, hooks, calculations, etc)     │
└─────────────────────────────────────────┘
```

### Project Structure

```
📦 packages/test-utils/          ← Shared test utilities
├── src/
│   ├── setup.ts                 ← Global test config
│   ├── fixtures.ts              ← Mock data
│   └── mocks.ts                 ← Test utilities
└── vitest.config.ts             ← Base config

📦 packages/ui/                  ← Component library
├── src/components/
├── __tests__/
│   ├── unit/
│   ├── components/
│   └── integration/
└── vitest.config.ts

📱 apps/user-dashboard/          ← Dashboard app
├── src/
├── __tests__/                   ← Unit + component tests
└── e2e/                         ← E2E tests
└── vitest.config.ts

📱 apps/web/                     ← Marketing site
├── src/
├── __tests__/
└── e2e/
└── vitest.config.ts

📄 Root
├── playwright.config.ts         ← E2E configuration
├── turbo.json                   ← Test tasks
├── package.json                 ← Test scripts
└── .github/workflows/test.yml   ← CI/CD
```

## 📊 What's Included

### Tools

- ✅ **Vitest** - Unit & component testing (fast, Vite-native)
- ✅ **Playwright** - E2E testing (multi-browser)
- ✅ **React Testing Library** - Component testing (user-centric)
- ✅ **@vitest/ui** - Interactive test dashboard
- ✅ **Coverage v8** - Code coverage tracking

### Configuration

- ✅ Vitest config (base + per-package)
- ✅ Playwright config (multi-browser, mobile)
- ✅ TypeScript support
- ✅ Path aliases (`@/` in tests)
- ✅ Global test setup (mocks, cleanup)

### Test Utilities (@workspace/test-utils)

- ✅ Re-exported Testing Library APIs
- ✅ Mock data factories (users, admins)
- ✅ Mock utilities (localStorage, fetch)
- ✅ Global setup (cleanup, browser mocks)

### Documentation

- ✅ Quick start guide (5 min)
- ✅ Complete testing reference
- ✅ 30+ copy-paste test examples
- ✅ Best practices guide
- ✅ Verification checklist

### CI/CD

- ✅ GitHub Actions workflow
- ✅ Unit test automation
- ✅ E2E test automation
- ✅ Coverage reporting (Codecov)
- ✅ Artifact uploads

### Developer Experience

- ✅ VS Code extensions recommendations
- ✅ Turbo integration (parallel tests)
- ✅ Watch mode with auto-reload
- ✅ Interactive UI dashboard
- ✅ Error suppression

## 🎯 Common Commands

### Unit & Component Tests

```bash
# Run all tests once
pnpm test

# Watch mode (auto-reload on changes)
pnpm test:watch

# Interactive UI dashboard
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Specific package
turbo test --filter=@workspace/ui
```

### E2E Tests

```bash
# Run E2E tests (requires dev server running)
pnpm test:e2e

# Interactive E2E dashboard
pnpm test:e2e:ui

# Specific test file
pnpm exec playwright test apps/user-dashboard/e2e/login.e2e.spec.ts

# Debug mode
pnpm exec playwright test --debug
```

### Development Workflow

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run tests in watch mode
pnpm test:watch

# Terminal 3: Or use UI dashboard
pnpm test:ui
```

## 📝 Writing Your First Test

### 1. Create test file

```typescript
// apps/user-dashboard/__tests__/components/MyComponent.test.tsx
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. Run tests

```bash
pnpm test:watch
```

### 3. See it pass ✅

## 💡 Test Organization

### By Level

```
__tests__/
├── unit/              # Utility functions, helpers
│   └── math.test.ts
├── components/        # React components
│   └── Button.test.tsx
└── integration/       # Multi-component flows
    └── Checkout.test.tsx

e2e/
├── login.e2e.spec.ts          # Authentication
├── dashboard.e2e.spec.ts      # Main workflows
└── checkout.e2e.spec.ts       # Critical paths
```

### Naming Convention

```
✅ Correct
- Button.test.tsx
- utils.test.ts
- login.e2e.spec.ts

❌ Wrong
- Button.spec.tsx (use .test instead)
- test_button.tsx (reverse naming)
- button-test.tsx (use . not -)
```

## 📊 Coverage Targets

| Level      | Packages | Apps |
| ---------- | -------- | ---- |
| Statements | 60%      | 40%  |
| Branches   | 60%      | 40%  |
| Functions  | 80%      | 40%  |
| Lines      | 60%      | 40%  |

Start achievable, increase gradually. ↗️

## ✨ Key Features

### 1. Shared Test Utilities

Import everything from one place:

```typescript
import { describe, it, expect, render, screen, vi } from '@workspace/test-utils';
import { createMockUser, mockLocalStorage } from '@workspace/test-utils/fixtures';
```

### 2. Global Test Setup

Automatic:

- DOM cleanup after each test
- Browser API mocks (matchMedia, IntersectionObserver)
- jsdom environment
- TypeScript support

### 3. Turbo Integration

Parallel test execution across packages:

```bash
pnpm test  # Runs all package tests in parallel
```

### 4. Interactive UI

```bash
pnpm test:ui  # Opens http://localhost:51204
```

- Run/filter tests
- Watch individual tests
- View code coverage
- Debug with browser

### 5. Coverage Reports

```bash
pnpm test:coverage
# Open coverage/index.html
```

- Line-by-line coverage
- Branch coverage
- Visual highlighting

## 🔄 CI/CD Pipeline

GitHub Actions automatically:

1. **On every PR:**
   - Runs linter
   - Type checking
   - Unit & component tests
   - Uploads coverage

2. **On main/develop push:**
   - Same as above
   - Plus E2E tests
   - Generates HTML reports

Status badges on PR: ✅ / ❌

## 🧠 Best Practices

### ✅ DO

```typescript
// Test user behavior
it('shows error when email is invalid', () => {
  render(<Form />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid' }});
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});

// Use semantic queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// Keep tests focused
describe('LoginForm', () => {
  it('submits with valid email', () => { ... });
  it('shows error with invalid email', () => { ... });
});
```

### ❌ DON'T

```typescript
// Don't test implementation details
expect(wrapper.find('.submit-btn')).toHaveLength(1)

// Don't use test IDs if semantic query available
screen.getByTestId('button-submit')  // ❌ Use getByRole instead

// Don't create test interdependencies
it('step 1: login', () => { ... });
it('step 2: assumes logged in', () => { ... });
```

## 🐛 Common Issues & Fixes

### Issue: Tests won't import @workspace/test-utils

**Fix:**

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: E2E tests timeout

**Fix:**

```typescript
test.setTimeout(60000); // Increase timeout
```

### Issue: Component not rendering

**Fix:**

```typescript
// Wrap with required providers
render(
  <AuthProvider>
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  </AuthProvider>
);
```

## 📚 Learning Path

1. **Start:** `TESTING_QUICKSTART.md` (5 min)
2. **Explore:** `TEST_EXAMPLES.md` (copy examples)
3. **Reference:** `TESTING.md` (when you get stuck)
4. **Verify:** `TEST_SETUP_VERIFICATION.md` (check setup)
5. **Dive Deep:** Original documentation links

## 🎯 Success Criteria

Your setup is working when:

- ✅ `pnpm test` runs all tests successfully
- ✅ `pnpm test:watch` auto-reloads tests
- ✅ `pnpm test:ui` opens dashboard
- ✅ Example tests in `__tests__` pass
- ✅ E2E tests can run with `pnpm test:e2e`
- ✅ Coverage reports generate
- ✅ No import errors

## 🚀 Next Steps

1. **Read** `TESTING_QUICKSTART.md` (now)
2. **Run** `pnpm test:watch` (next)
3. **Copy** a pattern from `TEST_EXAMPLES.md`
4. **Write** your first real test
5. **Celebrate** when it passes ✅

## 💬 Questions?

Check these in order:

1. `TESTING_QUICKSTART.md` - Quick answers
2. `TEST_EXAMPLES.md` - See similar examples
3. `TESTING.md` - Complete reference
4. Original documentation (links in TESTING.md)

## 📄 Full Documentation

- **Quick Start:** [TESTING_QUICKSTART.md](TESTING_QUICKSTART.md)
- **Complete Guide:** [TESTING.md](TESTING.md)
- **Examples:** [TEST_EXAMPLES.md](TEST_EXAMPLES.md)
- **Summary:** [TEST_SETUP_SUMMARY.md](TEST_SETUP_SUMMARY.md)
- **Verification:** [TEST_SETUP_VERIFICATION.md](TEST_SETUP_VERIFICATION.md)

---

**Ready to test?** 🚀

```bash
pnpm install && pnpm test
```

All green checkmarks = success ✅

Happy testing! 🎉
