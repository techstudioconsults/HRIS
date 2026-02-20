# Test Examples & Patterns

This document provides copy-paste ready test examples for common scenarios.

## Table of Contents

1. [Unit Tests](#unit-tests)
2. [Component Tests](#component-tests)
3. [Form Testing](#form-testing)
4. [API/Async Testing](#async-testing)
5. [Custom Hooks](#custom-hooks)
6. [E2E Tests](#e2e-tests)

## Unit Tests

### Simple Function Testing

```typescript
import { describe, it, expect } from '@workspace/test-utils';

// Function to test
const calculateDiscount = (price: number, discountPercent: number) => {
  return price - (price * discountPercent) / 100;
};

describe('calculateDiscount', () => {
  it('should apply discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });

  it('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
```

### Testing with Multiple Assertions

```typescript
import { describe, it, expect } from '@workspace/test-utils';

const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

describe('parseDate', () => {
  it('should parse date correctly', () => {
    const result = parseDate('2024-03-15');

    expect(result.year).toBe(2024);
    expect(result.month).toBe(3);
    expect(result.day).toBe(15);
  });
});
```

## Component Tests

### Simple Component

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';

const Badge = ({ variant = 'default', children }: any) => (
  <span className={`badge-${variant}`}>{children}</span>
);

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with custom variant', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(container.querySelector('.badge-success')).toBeInTheDocument();
  });
});
```

### Component with Props

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';
import { render, screen } from '@workspace/test-utils';

const Button = ({ children, onClick, disabled }: any) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Component with State (Simulated)

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen, fireEvent } from '@workspace/test-utils';
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('Counter', () => {
  it('displays initial count', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments count when button clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });

    fireEvent.click(button);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

## Form Testing

### Basic Form Test

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';
import { render, screen, fireEvent, waitFor } from '@workspace/test-utils';

const LoginForm = ({ onSubmit }: any) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
    <label>Email: <input type="email" /></label>
    <label>Password: <input type="password" /></label>
    <button type="submit">Login</button>
  </form>
);

describe('LoginForm', () => {
  it('submits form with values', async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('shows error for empty email', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    // Add validation checks
    const emailInput = screen.getByDisplayValue('');
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});
```

### Form with React Hook Form

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';
import { render, screen, waitFor } from '@workspace/test-utils';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

const UserForm = ({ onSubmit }: any) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      <input {...register('email')} placeholder="Email" type="email" />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('UserForm', () => {
  it('submits form with correct values', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<UserForm onSubmit={handleSubmit} />);

    await user.type(screen.getByPlaceholderText('Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });
});
```

## Async Testing

### Fetching Data

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';
import { render, screen, waitFor } from '@workspace/test-utils';

const UserList = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

describe('UserList', () => {
  it('loads and displays users', async () => {
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsers),
      })
    ) as any;

    render(<UserList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as any;

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading users')).toBeInTheDocument();
    });
  });
});
```

### Using Fixtures for API Mocking

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { render, screen, waitFor } from '@workspace/test-utils';
import { createMockUser } from '@workspace/test-utils/fixtures';

describe('UserProfile', () => {
  it('displays user profile', async () => {
    const mockUser = createMockUser({ name: 'John Doe' });

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
      })
    ) as any;

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

## Custom Hooks

### Testing Hook Logic

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { renderHook, act, waitFor } from '@testing-library/react';

const useCounter = () => {
  const [count, setCount] = React.useState(0);

  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
  };
};

describe('useCounter', () => {
  it('initializes with 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });
});
```

### Hook with Async

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';
import { renderHook, waitFor } from '@testing-library/react';

const useFetchUser = (id: string) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  return { user, loading };
};

describe('useFetchUser', () => {
  it('fetches user data', async () => {
    const mockUser = { id: '1', name: 'John' };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
      })
    ) as any;

    const { result } = renderHook(() => useFetchUser('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });
});
```

## E2E Tests

### Basic Navigation

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays welcome message', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('navigates to about page', async ({ page }) => {
    await page.click('a:has-text("About")');
    await expect(page).toHaveURL('/about');
  });
});
```

### Login Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('logs in successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

### Form Submission

```typescript
import { test, expect } from '@playwright/test';

test('submits form successfully', async ({ page }) => {
  await page.goto('/form');

  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.selectOption('select[name="role"]', 'admin');
  await page.check('input[type="checkbox"]');

  await page.click('button[type="submit"]');

  await expect(page.locator('text=Form submitted')).toBeVisible();
});
```

### Data Table Interaction

```typescript
import { test, expect } from '@playwright/test';

test('filters table data', async ({ page }) => {
  await page.goto('/users');

  // Search for user
  await page.fill('input[placeholder="Search"]', 'John');

  // Wait for results
  await page.waitForLoadState('networkidle');

  // Verify results
  const rows = page.locator('tbody tr');
  expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('John');
});
```

## Mocking Patterns

### Using Test Fixtures

```typescript
import { describe, it, expect } from '@workspace/test-utils';
import { createMockUser, mockApiResponse } from '@workspace/test-utils/fixtures';

describe('User Module', () => {
  it('creates user correctly', () => {
    const user = createMockUser({
      email: 'custom@example.com',
      role: 'admin',
    });

    expect(user.email).toBe('custom@example.com');
    expect(user.role).toBe('admin');
  });
});
```

### Mocking Modules

```typescript
import { describe, it, expect, vi } from '@workspace/test-utils';

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
  }),
}));

describe('Page Component', () => {
  it('uses router', () => {
    // Your test here
  });
});
```

---

**Copy and modify these examples for your specific use cases!**
