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
