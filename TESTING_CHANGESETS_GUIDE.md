# Testing & Changesets Configuration

This monorepo is configured with comprehensive testing and version management tools.

## 🧪 Testing Setup

### Vitest (Unit & Integration Tests)

Vitest is configured for all apps and packages in the monorepo with workspace support.

#### Configuration Files
- `vitest.config.ts` - Base Vitest configuration
- `vitest.workspace.ts` - Workspace configuration for all apps and packages
- `tests/setup.ts` - Global test setup with React Testing Library

#### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

#### Writing Unit Tests

Create test files alongside your source code with `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` extensions:

**For utility/logic tests:**
```typescript
import { describe, it, expect } from 'vitest';

describe('myFunction', () => {
  it('should work correctly', () => {
    expect(myFunction(1, 2)).toBe(3);
  });
});
```

**For React component tests (inside apps where React is installed):**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Playwright (E2E Tests)

Playwright is configured for end-to-end testing across all browsers.

#### Configuration
- `playwright.config.ts` - Playwright configuration with multi-browser support
- `tests/e2e/` - E2E test files

#### Running E2E Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run e2e tests with UI mode
pnpm test:e2e:ui

# Run e2e tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug e2e tests
pnpm test:e2e:debug
```

#### Writing E2E Tests

Create test files in `tests/e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```

#### Browsers Configured
- Chromium (Desktop)
- Firefox (Desktop)
- Webkit (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## 📦 Changesets

Changesets helps manage versioning and changelogs in this monorepo.

### Configuration
- `.changeset/config.json` - Changesets configuration
- `.changeset/` - Stores changeset files

### Using Changesets

#### Creating a Changeset

When you make changes that should trigger a version bump:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose version bump type (major, minor, patch)
3. Write a summary of the changes

#### Versioning Packages

To consume changesets and update package versions:

```bash
pnpm changeset:version
```

This will:
- Update package versions based on changesets
- Update dependencies between packages
- Generate/update CHANGELOG.md files
- Remove consumed changeset files

#### Publishing Packages

To publish updated packages:

```bash
pnpm changeset:publish
```

### Changeset Workflow

1. Make your changes to code
2. Run `pnpm changeset` to document the change
3. Commit the changeset file with your changes
4. On release: run `pnpm changeset:version` to bump versions
5. Review and commit version changes
6. Run `pnpm changeset:publish` to publish (if applicable)

### Configuration Details

- **Base Branch**: `main`
- **Access**: `restricted` (private packages by default)
- **Internal Dependencies**: Updated with `patch` bumps
- **Ignored Packages**: 
  - `@workspace/eslint-config`
  - `@workspace/typescript-config`

## 📁 Project Structure

```
/
├── .changeset/              # Changesets configuration and files
├── tests/                   # Root-level tests
│   ├── e2e/                # E2E tests for all apps
│   ├── setup.ts            # Vitest global setup
│   └── README.md           # Testing documentation
├── playwright.config.ts     # Playwright configuration
├── vitest.config.ts        # Base Vitest configuration
├── vitest.workspace.ts     # Vitest workspace setup
├── apps/                   # Application packages
│   ├── user-dashboard/
│   ├── controller-dashboard/
│   └── web/
└── packages/               # Shared packages
    ├── ui/
    ├── eslint-config/
    └── typescript-config/
```

## 🔧 Dependencies Installed

### Testing
- `@playwright/test` - E2E testing framework
- `vitest` - Unit testing framework
- `@vitest/ui` - Vitest UI mode
- `@vitest/coverage-v8` - Coverage reporting
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Jest DOM matchers
- `@vitejs/plugin-react` - React support for Vitest
- `jsdom` - DOM implementation for Node.js

### Version Management
- `@changesets/cli` - Version management tool

## 📝 Best Practices

### Testing
1. Write tests close to your source code
2. Use descriptive test names
3. Test user behavior, not implementation details
4. Keep tests fast and isolated
5. Use the workspace configuration to run specific app tests

### Changesets
1. Create a changeset for every PR with user-facing changes
2. Write clear, user-focused changeset summaries
3. Use semantic versioning correctly:
   - **Major**: Breaking changes
   - **Minor**: New features (backwards compatible)
   - **Patch**: Bug fixes and minor changes
4. Group related changes in a single changeset

## 🚀 CI/CD Integration

Add these scripts to your CI pipeline:

```yaml
# Testing
- pnpm test
- pnpm test:coverage
- pnpm test:e2e

# Version management
- pnpm changeset:version
- pnpm changeset:publish
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Testing Library Documentation](https://testing-library.com/)
