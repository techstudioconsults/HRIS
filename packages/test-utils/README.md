# @workspace/test-utils

Shared testing utilities and setup for the HRIS mono-repo.

## Features

- **Setup**: Pre-configured Vitest with common mocks (matchMedia, IntersectionObserver, ResizeObserver)
- **Fixtures**: Mock data factories for testing
- **Mocks**: Utilities for mocking localStorage, sessionStorage, fetch, etc.
- **Testing Library**: Re-exported React Testing Library utilities

## Installation

This package is already configured in the mono-repo and used by all packages.

## Usage

### Basic Setup

Every package using tests should extend their `vitest.config.ts` from the base config:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@workspace/test-utils/vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    // Package-specific overrides here
  })
);
```

### Import Test Utilities

```typescript
import { render, screen, expect, describe, it, vi } from '@workspace/test-utils';
import { createMockUser, mockLocalStorage } from '@workspace/test-utils/fixtures';

describe('MyComponent', () => {
  it('should render', () => {
    const mockUser = createMockUser({ name: 'John' });
    render(<MyComponent user={mockUser} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Using Fixtures

```typescript
import {
  createMockUser,
  createMockAdmin,
} from '@workspace/test-utils/fixtures';

const user = createMockUser({ email: 'custom@example.com' });
const admin = createMockAdmin({ role: 'super-admin' });
```

### Using Mocks

```typescript
import {
  mockLocalStorage,
  mockFetch,
  resetMocks,
} from '@workspace/test-utils/mocks';

beforeEach(() => {
  mockLocalStorage.clear();
  resetMocks();
});

it('should save to localStorage', () => {
  mockLocalStorage.setItem('key', 'value');
  expect(mockLocalStorage.getItem('key')).toBe('value');
});
```

## File Structure

```
packages/test-utils/
├── src/
│   ├── index.ts      # Main exports
│   ├── setup.ts      # Vitest setup file
│   ├── fixtures.ts   # Test data factories
│   └── mocks.ts      # Mock utilities
├── vitest.config.ts  # Base Vitest configuration
├── tsconfig.json     # TypeScript configuration
└── package.json
```

## Configuration

The `vitest.config.ts` includes:

- **Environment**: JSDOM (for DOM testing)
- **Setup Files**: Automatic cleanup, global mocks
- **Coverage Thresholds**:
  - Statements: 60%
  - Branches: 60%
  - Functions: 80%
  - Lines: 60%

## Scripts

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui

# Coverage report
pnpm test:coverage
```
