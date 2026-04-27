import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/schemas';
import { signMeta, verifyMeta } from '@/lib/session/session-manager';
import { tokenManager } from '@/lib/http/token-manager';
import type { SessionMeta } from '@/lib/session/types';

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------

describe('loginSchema', () => {
  const credentials = { email: 'user@example.com', password: 'secret' };

  it('accepts valid credentials', () => {
    expect(() => loginSchema.parse(credentials)).not.toThrow();
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      ...credentials,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'Please enter a valid email address'
      );
    }
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ ...credentials, password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Password is required'
      );
    }
  });
});

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------

describe('registerSchema', () => {
  const valid = {
    companyName: 'Acme',
    domain: 'acme',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara@acme.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
  };

  it('accepts valid registration data', () => {
    expect(() => registerSchema.parse(valid)).not.toThrow();
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'DifferentPass!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // refine() uses path ['password_confirmation'] — check issues directly
      expect(
        result.error.issues.some(
          (i) =>
            i.path[0] === 'password_confirmation' &&
            i.message === "Passwords don't match"
        )
      ).toBe(true);
    }
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Password must be at least 8 characters'
      );
    }
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad-email' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// forgotPasswordSchema
// ---------------------------------------------------------------------------

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(() =>
      forgotPasswordSchema.parse({ email: 'user@example.com' })
    ).not.toThrow();
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resetPasswordSchema
// ---------------------------------------------------------------------------

describe('resetPasswordSchema', () => {
  const valid = {
    password: 'NewSecurePass!',
    confirmPassword: 'NewSecurePass!',
  };

  it('accepts matching passwords', () => {
    expect(() => resetPasswordSchema.parse(valid)).not.toThrow();
  });

  it('rejects mismatched passwords', () => {
    const result = resetPasswordSchema.safeParse({
      ...valid,
      confirmPassword: 'Different!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // refine() uses path ['password_confirmation'] — check issues directly
      expect(
        result.error.issues.some(
          (i) =>
            i.path[0] === 'password_confirmation' &&
            i.message === "Passwords don't match"
        )
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// U-10 to U-13 — SessionManager (HMAC-SHA256 sign / verify)
// ---------------------------------------------------------------------------

describe('SessionManager', () => {
  const SECRET = 'test-secret-at-least-32-chars!!';
  const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600; // 1 hr from now

  const validPayload: SessionMeta = {
    id: 'emp_01',
    fullName: 'Amara Okafor',
    email: 'amara@acme.com',
    role: { id: 'role_01', name: 'owner' },
    permissions: ['admin:admin'],
    exp: FUTURE_EXP,
  };

  it('U-10: sign() returns a non-empty dot-separated string', async () => {
    const signed = await signMeta(validPayload, SECRET);
    expect(signed).toBeTruthy();
    expect(signed.split('.').length).toBe(2); // <payload>.<signature>
  });

  it('U-11: verify() returns the original payload for a valid signature', async () => {
    const signed = await signMeta(validPayload, SECRET);
    const result = await verifyMeta(signed, SECRET);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(validPayload.id);
    expect(result?.email).toBe(validPayload.email);
    expect(result?.permissions).toEqual(validPayload.permissions);
    expect(result?.role).toEqual(validPayload.role);
  });

  it('U-12: verify() returns null for a tampered signature', async () => {
    const signed = await signMeta(validPayload, SECRET);
    // Corrupt the last 4 characters of the signature segment
    const tampered = signed.slice(0, -4) + 'XXXX';
    const result = await verifyMeta(tampered, SECRET);

    expect(result).toBeNull();
  });

  it('U-13: verify() returns null when exp is in the past', async () => {
    const expiredPayload: SessionMeta = {
      ...validPayload,
      exp: Math.floor(Date.now() / 1000) - 60, // 60 seconds ago
    };
    const signed = await signMeta(expiredPayload, SECRET);
    const result = await verifyMeta(signed, SECRET);

    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// U-14 to U-17 — TokenManager (in-memory cache + coalescing)
// ---------------------------------------------------------------------------

describe('TokenManager', () => {
  beforeEach(() => {
    tokenManager.invalidate(); // reset singleton state between tests
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('U-14: getAccessToken() returns the cached token without fetching', async () => {
    tokenManager.setToken('cached-token', Date.now() + 10 * 60 * 1000); // 10 min from now
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    const token = await tokenManager.getAccessToken();

    expect(token).toBe('cached-token');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('U-15: getAccessToken() fetches a new token when the cache is empty', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'fresh-token',
        expiresAt: Date.now() + 3_600_000,
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const token = await tokenManager.getAccessToken();

    expect(token).toBe('fresh-token');
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/token',
      expect.any(Object)
    );
  });

  it('U-16: getAccessToken() coalesces concurrent calls into a single fetch', async () => {
    let resolveFetch!: (value: unknown) => void;
    const gate = new Promise<unknown>((resolve) => {
      resolveFetch = resolve;
    });

    const mockFetch = vi.fn().mockImplementationOnce(() =>
      gate.then(() => ({
        ok: true,
        json: async () => ({
          accessToken: 'coalesced-token',
          expiresAt: Date.now() + 3_600_000,
        }),
      }))
    );
    vi.stubGlobal('fetch', mockFetch);

    // Start two calls before the first fetch resolves
    const p1 = tokenManager.getAccessToken();
    const p2 = tokenManager.getAccessToken();

    resolveFetch(undefined); // unblock the in-flight fetch

    const [t1, t2] = await Promise.all([p1, p2]);

    expect(t1).toBe('coalesced-token');
    expect(t2).toBe('coalesced-token');
    expect(mockFetch).toHaveBeenCalledTimes(1); // only one HTTP call fired
  });

  it('U-17: invalidate() clears the cache so the next call re-fetches', async () => {
    tokenManager.setToken('stale-token', Date.now() + 10 * 60 * 1000);

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'post-invalidate-token',
        expiresAt: Date.now() + 3_600_000,
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    tokenManager.invalidate();
    const token = await tokenManager.getAccessToken();

    expect(token).toBe('post-invalidate-token');
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
