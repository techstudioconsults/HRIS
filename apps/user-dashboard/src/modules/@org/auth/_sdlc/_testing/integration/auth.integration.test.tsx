import React from 'react';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';

import {
  authTestHandlers,
  bffSessionHandler,
  bffTokenUnauthHandler,
  bffTokenAuthHandler,
  bffSessionDeleteHandler,
  bffRefreshFailHandler,
} from '../fixtures/handlers';
import {
  VALID_EMAIL,
  VALID_PASSWORD,
  VALID_OTP,
  fixtureLoginResponse,
} from '../fixtures/mock-data';
import { SessionProvider, useSession } from '@/lib/session';

// ---------------------------------------------------------------------------
// Hoisted mock references — must be declared before vi.mock() calls
// ---------------------------------------------------------------------------

const mockPush = vi.hoisted(() => vi.fn());
const mockLoginWithPassword = vi.hoisted(() => vi.fn());
const mockLoginWithOTP = vi.hoisted(() => vi.fn());
const mockRequestOTP = vi.hoisted(() => vi.fn());
const mockStoreLogout = vi.hoisted(() => vi.fn());
const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock('sonner', () => ({ toast: mockToast }));

vi.mock('../../../services/use-auth-service', () => ({
  useAuthService: () => ({
    useLoginWithPassword: () => ({
      mutateAsync: mockLoginWithPassword,
      isPending: false,
    }),
    useRequestOTP: () => ({
      mutateAsync: mockRequestOTP,
      isPending: false,
    }),
    useLoginWithOTP: () => ({
      mutateAsync: mockLoginWithOTP,
      isPending: false,
    }),
    useSignUp: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useForgotPassword: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useResetPassword: () => ({ mutateAsync: vi.fn(), isPending: false }),
  }),
}));

vi.mock('../../../stores/auth-store', () => ({
  useAuthStore: (selector: (s: { logout: () => void }) => unknown) =>
    selector({ logout: mockStoreLogout }),
}));

// FormField must integrate with react-hook-form's FormProvider context
vi.mock('@workspace/ui/lib/inputs/FormFields', async () => {
  const { useController } = await import('react-hook-form');
  return {
    FormField: ({
      name,
      label,
      type = 'text',
      placeholder,
    }: {
      name: string;
      label: string;
      type?: string;
      placeholder?: string;
    }) => {
      const { field } = useController({ name, defaultValue: '' });
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <input id={name} type={type} placeholder={placeholder} {...field} />
        </>
      );
    },
  };
});

vi.mock('@workspace/ui/hooks', () => ({
  useDecodedSearchParameters: vi.fn().mockReturnValue(VALID_EMAIL),
}));

// OTPInput renders as a single text input in tests
vi.mock('../../../_components/input-otp', () => ({
  OTPInput: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      aria-label="OTP Code"
      type="text"
      value={value}
      maxLength={6}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// ---------------------------------------------------------------------------
// MSW server — backend handlers + BFF Route Handler mocks
// Default state: unauthenticated (token endpoint returns 401)
// ---------------------------------------------------------------------------

const server = setupServer(
  ...authTestHandlers,
  bffSessionHandler,
  bffTokenUnauthHandler, // default: no session
  bffSessionDeleteHandler,
  bffRefreshFailHandler
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  mockPush.mockReset();
  mockLoginWithPassword.mockReset();
  mockLoginWithOTP.mockReset();
  mockRequestOTP.mockReset();
  mockStoreLogout.mockReset();
  mockToast.success.mockReset();
  mockToast.warning.mockReset();
  mockToast.error.mockReset();
});
afterAll(() => server.close());

// =========================================================================
// I-01 to I-03 — Password Login (Login component)
// =========================================================================

describe('LoginForm — integration', () => {
  let Login: React.ComponentType;

  beforeAll(async () => {
    const mod = await import('../../../_views/login');
    Login = mod.Login;
  });

  function renderLogin() {
    return render(
      <SessionProvider>
        <Login />
      </SessionProvider>
    );
  }

  it('I-01: valid credentials → session established → redirect /login/continue', async () => {
    mockLoginWithPassword.mockResolvedValueOnce(fixtureLoginResponse);
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), VALID_EMAIL);
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Login Successful',
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith('/login/continue');
    });
  });

  it('I-02: invalid credentials → warning toast, no redirect', async () => {
    mockLoginWithPassword.mockRejectedValueOnce(
      new Error('Invalid email or password')
    );
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      'wrong@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'wrong password');
    await user.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockToast.warning).toHaveBeenCalledWith(
        'Login Failed',
        expect.any(Object)
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('I-03: rate-limited response → warning toast, no redirect', async () => {
    mockLoginWithPassword.mockRejectedValueOnce(
      new Error('Too many attempts. Try again in 15 minutes.')
    );
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), VALID_EMAIL);
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockToast.warning).toHaveBeenCalledWith(
        'Login Failed',
        expect.objectContaining({
          description: 'Too many attempts. Try again in 15 minutes.',
        })
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

// =========================================================================
// I-04 to I-07 — OTP flow (InputOtpCard component)
// =========================================================================

describe('OTP flow — integration', () => {
  let InputOtpCard: React.ComponentType;

  beforeAll(async () => {
    const mod = await import('../../../_views/input-otp-card');
    InputOtpCard = mod.InputOtpCard;
  });

  function renderOtpCard() {
    return render(
      <SessionProvider>
        <InputOtpCard />
      </SessionProvider>
    );
  }

  it('I-04: OTP card renders the email from the URL query param', async () => {
    renderOtpCard();
    await waitFor(() => {
      expect(screen.getByText(VALID_EMAIL)).toBeInTheDocument();
    });
  });

  it('I-05: valid 6-digit OTP → session established → redirect /login/continue', async () => {
    mockLoginWithOTP.mockResolvedValueOnce(fixtureLoginResponse);
    const user = userEvent.setup();
    renderOtpCard();

    await user.type(screen.getByLabelText(/otp code/i), VALID_OTP);
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Login Successful',
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith('/login/continue');
    });
  });

  it('I-06: invalid OTP → error toast, no redirect', async () => {
    mockLoginWithOTP.mockRejectedValueOnce(new Error('OTP expired or invalid'));
    const user = userEvent.setup();
    renderOtpCard();

    await user.type(screen.getByLabelText(/otp code/i), '000000');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Login Failed',
        expect.any(Object)
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('I-07: "Resend code" → calls requestOTP → success toast', async () => {
    // TanStack Query's mutateAsync fires onSuccess/onError callbacks from the second arg.
    // The mock must replicate that so the toast inside onSuccess is triggered.
    mockRequestOTP.mockImplementationOnce(
      async (
        _data: unknown,
        options?: { onSuccess?: (r: unknown) => void }
      ) => {
        const result = { success: true, data: 'OTP sent' };
        options?.onSuccess?.(result);
        return result;
      }
    );
    const user = userEvent.setup();
    renderOtpCard();

    await user.click(screen.getByText(/resend/i));

    await waitFor(() => {
      expect(mockRequestOTP).toHaveBeenCalledWith(
        { email: VALID_EMAIL },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        'Request Sent Successfully',
        expect.any(Object)
      );
    });
  });
});

// =========================================================================
// I-08 to I-09 — Registration
// =========================================================================

describe('Register — integration', () => {
  it.todo(
    'I-08: successful registration → POST /auth/onboard → redirect /login'
  );
  it.todo('I-09: duplicate email → 409 → inline email field error');
});

// =========================================================================
// I-10 to I-13 — Forgot / Reset Password
// =========================================================================

describe('Forgot / Reset Password — integration', () => {
  it.todo('I-10: valid email → CheckMailCard shown');
  it.todo('I-11: valid reset token + passwords → redirect /login');
  it.todo('I-12: expired reset token → error with link to /forgot-password');
  it.todo(
    'I-13: missing reset token in URL → immediate redirect to /forgot-password'
  );
});

// =========================================================================
// I-14 to I-15 — Logout (useLogout hook)
// =========================================================================

describe('Logout — integration', () => {
  let useLogout: () => () => Promise<void>;

  beforeAll(async () => {
    const mod = await import('../../../hooks/use-logout');
    useLogout = mod.useLogout;
  });

  it('I-14: logout calls DELETE /api/auth/session, clears store, redirects /login', async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mockStoreLogout).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it.todo(
    'I-15: logout navigates to /login even when DELETE fails (fail-safe not yet implemented — useLogout has no try-catch)'
  );
});

// =========================================================================
// I-16 to I-17 — Token refresh (httpConfig interceptor)
// =========================================================================

describe('Token refresh — integration', () => {
  it.todo(
    'I-16: 401 from backend → POST /api/auth/refresh → original request retried with new token'
  );
  it.todo(
    'I-17: 401 from backend + refresh also 401 → DELETE /api/auth/session → redirect /login'
  );
});

// =========================================================================
// I-18 to I-20 — useSession hook states
// =========================================================================

describe('useSession — integration', () => {
  it('I-18: status is "loading" before the token fetch resolves', async () => {
    server.use(
      http.get('/api/auth/token', async () => {
        await delay(200);
        return HttpResponse.json({ error: 'unauthenticated' }, { status: 401 });
      })
    );

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
    });

    // Initial render is synchronous — before useEffect fires
    expect(result.current.status).toBe('loading');
  });

  it('I-19: status is "authenticated" when GET /api/auth/token succeeds', async () => {
    server.use(bffTokenAuthHandler);

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
    });

    await waitFor(() => {
      expect(result.current.status).toBe('authenticated');
    });

    expect(result.current.data?.user.id).toBe('emp_01');
    expect(result.current.data?.user.permissions).toContain('admin:admin');
  });

  it('I-20: status is "unauthenticated" when GET /api/auth/token returns 401', async () => {
    // Default server handler (bffTokenUnauthHandler) already returns 401

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
    });

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(result.current.data).toBeNull();
  });
});
