import { http, HttpResponse, delay } from 'msw';
import {
  mockAuthResponse,
  VALID_EMAIL,
  VALID_PASSWORD,
  VALID_OTP,
} from './mock-data';

export const authHandlers = [
  // Registration
  http.post('/auth/onboard', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Record<string, string>;

    if (body.email === VALID_EMAIL) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/conflict',
          title: 'Email already registered',
          status: 409,
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      { success: true, data: 'created' },
      { status: 201 }
    );
  }),

  // Password login (called by NextAuth credentials provider internally)
  http.post('/auth/login/password', async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as Record<string, string>;

    if (body.email !== VALID_EMAIL || body.password !== VALID_PASSWORD) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/unauthorized',
          title: 'Invalid email or password',
          status: 401,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      employee: mockAuthResponse.user,
      tokens: mockAuthResponse.tokens,
      permissions: mockAuthResponse.permissions,
    });
  }),

  // OTP request
  http.post('/auth/login/requestotp', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, string>;

    if (!body.email) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/validation',
          title: 'Email required',
          status: 422,
        },
        { status: 422 }
      );
    }

    return HttpResponse.json({ success: true, data: 'OTP sent' });
  }),

  // OTP verify
  http.post('/auth/login/otp', async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as Record<string, string>;

    if (body.otp !== VALID_OTP) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/otp-invalid',
          title: 'OTP expired or invalid',
          status: 400,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      employee: mockAuthResponse.user,
      tokens: mockAuthResponse.tokens,
      permissions: mockAuthResponse.permissions,
    });
  }),

  // Forgot password
  http.post('/auth/forgotpassword', async () => {
    await delay(400);
    // Always 200 — no email enumeration
    return HttpResponse.json({ success: true, data: 'Reset email sent' });
  }),

  // Reset password
  http.post('/auth/resetpassword', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Record<string, string>;

    if (body.token === 'expired-token') {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/token-expired',
          title: 'Reset link has expired',
          status: 400,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({ success: true, data: 'Password reset' });
  }),
];

// Override handlers for specific test scenarios
export const invalidCredentialsHandler = http.post(
  '/auth/login/password',
  async () => {
    await delay(200);
    return HttpResponse.json(
      {
        type: 'https://hris.example.com/errors/unauthorized',
        title: 'Invalid email or password',
        status: 401,
      },
      { status: 401 }
    );
  }
);

export const rateLimitedHandler = http.post(
  '/auth/login/password',
  async () => {
    await delay(200);
    return HttpResponse.json(
      {
        type: 'https://hris.example.com/errors/rate-limited',
        title: 'Too many attempts. Try again in 15 minutes.',
        status: 429,
      },
      { status: 429 }
    );
  }
);

export const expiredResetTokenHandler = http.post(
  '/auth/resetpassword',
  async () => {
    await delay(200);
    return HttpResponse.json(
      {
        type: 'https://hris.example.com/errors/token-expired',
        title: 'Reset link has expired',
        status: 400,
      },
      { status: 400 }
    );
  }
);
