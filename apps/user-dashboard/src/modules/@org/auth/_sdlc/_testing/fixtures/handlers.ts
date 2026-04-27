import { http, HttpResponse, delay } from 'msw';
import {
  fixtureLoginResponse,
  VALID_EMAIL,
  VALID_PASSWORD,
  VALID_OTP,
  VALID_RESET_TOKEN,
} from './mock-data';

export const authTestHandlers = [
  http.post('/auth/login/password', async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as Record<string, string>;
    if (body.email === VALID_EMAIL && body.password === VALID_PASSWORD) {
      return HttpResponse.json(fixtureLoginResponse);
    }
    return HttpResponse.json(
      { title: 'Invalid email or password', status: 401 },
      { status: 401 }
    );
  }),

  http.post('/auth/onboard', async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as Record<string, string>;
    if (body.email === VALID_EMAIL) {
      return HttpResponse.json(
        { title: 'Email already registered', status: 409 },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      { success: true, data: 'created' },
      { status: 201 }
    );
  }),

  http.post('/auth/login/requestotp', async () => {
    await delay(50);
    return HttpResponse.json({ success: true, data: 'OTP sent' });
  }),

  http.post('/auth/login/otp', async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as Record<string, string>;
    if (body.otp !== VALID_OTP) {
      return HttpResponse.json(
        { title: 'OTP expired or invalid', status: 400 },
        { status: 400 }
      );
    }
    return HttpResponse.json(fixtureLoginResponse);
  }),

  http.post('/auth/forgotpassword', async () => {
    await delay(50);
    return HttpResponse.json({ success: true, data: 'Reset email sent' });
  }),

  http.post('/auth/resetpassword', async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as Record<string, string>;
    if (body.token !== VALID_RESET_TOKEN) {
      return HttpResponse.json(
        { title: 'Reset link has expired', status: 400 },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true, data: 'Password reset' });
  }),
];

export const invalidCredentialsHandler = http.post(
  '/auth/login/password',
  async () =>
    HttpResponse.json(
      { title: 'Invalid email or password', status: 401 },
      { status: 401 }
    )
);

export const rateLimitedAuthHandler = http.post(
  '/auth/login/password',
  async () =>
    HttpResponse.json(
      { title: 'Too many attempts. Try again in 15 minutes.', status: 429 },
      { status: 429 }
    )
);

export const expiredOtpHandler = http.post('/auth/login/otp', async () =>
  HttpResponse.json(
    { title: 'OTP expired or invalid', status: 400 },
    { status: 400 }
  )
);

export const expiredResetTokenHandler = http.post(
  '/auth/resetpassword',
  async () =>
    HttpResponse.json(
      { title: 'Reset link has expired', status: 400 },
      { status: 400 }
    )
);

// ---------------------------------------------------------------------------
// BFF Route Handler mocks (Next.js /api/auth/* endpoints)
// These are intercepted at the Next.js layer, not the backend.
// ---------------------------------------------------------------------------

/** POST /api/auth/session — set all three session cookies after login */
export const bffSessionHandler = http.post('/api/auth/session', async () =>
  HttpResponse.json({ ok: true })
);

/** GET /api/auth/token — returns token + user when session is valid */
export const bffTokenAuthHandler = http.get('/api/auth/token', async () =>
  HttpResponse.json({
    accessToken: 'mock-access-token',
    expiresAt: Date.now() + 3_600_000,
    user: {
      id: 'emp_01',
      employee: {
        id: 'emp_01',
        fullName: 'Amara Okafor',
        email: 'amara@acme.com',
        role: { id: 'role_01', name: 'owner' },
      },
      role: { id: 'role_01', name: 'owner' },
      permissions: ['admin:admin'],
    },
    expires: new Date(Date.now() + 3_600_000).toISOString(),
  })
);

/** GET /api/auth/token — 401 when no session cookie present */
export const bffTokenUnauthHandler = http.get('/api/auth/token', async () =>
  HttpResponse.json({ error: 'unauthenticated' }, { status: 401 })
);

/** DELETE /api/auth/session — clears session cookies on logout */
export const bffSessionDeleteHandler = http.delete(
  '/api/auth/session',
  async () => HttpResponse.json({ ok: true })
);

/** POST /api/auth/refresh — refreshes access token */
export const bffRefreshSuccessHandler = http.post(
  '/api/auth/refresh',
  async () =>
    HttpResponse.json({
      accessToken: 'refreshed-access-token',
      expiresAt: Date.now() + 3_600_000,
    })
);

/** POST /api/auth/refresh — 401 when refresh token is expired */
export const bffRefreshFailHandler = http.post('/api/auth/refresh', async () =>
  HttpResponse.json(
    { title: 'Refresh token expired', status: 401 },
    { status: 401 }
  )
);
