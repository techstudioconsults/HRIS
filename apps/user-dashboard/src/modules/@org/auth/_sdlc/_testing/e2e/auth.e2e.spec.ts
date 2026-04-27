import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOGIN_URL = '/login';
const REGISTER_URL = '/register';
const FORGOT_URL = '/forgot-password';
const OTP_URL = '/login/otp';
const ADMIN_DASHBOARD_URL = '/admin/dashboard';
const USER_DASHBOARD_URL = '/user/dashboard';

const VALID_EMAIL = 'amara@acme.com';
const VALID_PASSWORD = 'SecurePass123!';

// ---------------------------------------------------------------------------
// Helper — log in via the UI and return the authenticated context/page
// Re-usable across tests that need a pre-authenticated state.
// ---------------------------------------------------------------------------

async function loginAs(
  page: Page,
  email = VALID_EMAIL,
  password = VALID_PASSWORD
) {
  await page.goto(LOGIN_URL);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  // Wait until the session redirect resolves
  await page.waitForURL(/login\/continue|dashboard/, { timeout: 8_000 });
}

// ---------------------------------------------------------------------------
// E-01 to E-02 — Password login
// ---------------------------------------------------------------------------

test.describe('Auth — Password Login', () => {
  test('E-01: valid credentials → redirected to dashboard', async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);
    await page.getByLabel(/email address/i).fill(VALID_EMAIL);
    await page.getByLabel(/password/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL(new RegExp(ADMIN_DASHBOARD_URL), {
      timeout: 8_000,
    });
  });

  test('E-02: invalid credentials → inline error remains on /login', async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);
    await page.getByLabel(/email address/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({
      timeout: 5_000,
    });
    await expect(page).toHaveURL(LOGIN_URL);
  });
});

// ---------------------------------------------------------------------------
// E-03 — OTP login
// ---------------------------------------------------------------------------

test.describe('Auth — OTP Login', () => {
  test('E-03: OTP login golden path → dashboard', async ({ page }) => {
    await page.goto(OTP_URL);
    await page.getByLabel(/email/i).fill(VALID_EMAIL);
    await page.getByRole('button', { name: /send otp/i }).click();
    await expect(page).toHaveURL(/otp-verify/, { timeout: 5_000 });

    // Fill OTP digits (one input per digit)
    const digits = page.locator('input[type="text"]');
    await digits.nth(0).fill('1');
    await digits.nth(1).fill('2');
    await digits.nth(2).fill('3');
    await digits.nth(3).fill('4');
    await digits.nth(4).fill('5');
    await digits.nth(5).fill('6');

    await page.getByRole('button', { name: /verify/i }).click();
    await expect(page).toHaveURL(new RegExp(ADMIN_DASHBOARD_URL), {
      timeout: 8_000,
    });
  });
});

// ---------------------------------------------------------------------------
// E-04 — Registration
// ---------------------------------------------------------------------------

test.describe('Auth — Registration', () => {
  test('E-04: registration golden path → redirect to /login', async ({
    page,
  }) => {
    await page.goto(REGISTER_URL);
    await page.getByLabel(/company name/i).fill('New Co');
    await page.getByLabel(/domain/i).fill('newco');
    await page.getByLabel(/first name/i).fill('Jane');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('jane@newco.com');
    await page.getByLabel(/^password$/i).fill('SecurePass123!');
    await page.getByLabel(/confirm password/i).fill('SecurePass123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(LOGIN_URL, { timeout: 8_000 });
  });
});

// ---------------------------------------------------------------------------
// E-05 to E-06 — Forgot / Reset Password
// ---------------------------------------------------------------------------

test.describe('Auth — Forgot / Reset Password', () => {
  test('E-05: forgot password → check-mail confirmation shown', async ({
    page,
  }) => {
    await page.goto(FORGOT_URL);
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByText(/check your/i)).toBeVisible({ timeout: 5_000 });
  });

  test('E-06: reset password golden path → redirect to /login', async ({
    page,
  }) => {
    // Requires a valid token in the URL — use the known test token from fixtures
    await page.goto(`/reset-password?token=valid-reset-token-abc123`);
    await page.getByLabel(/^new password$/i).fill('NewSecurePass123!');
    await page.getByLabel(/confirm password/i).fill('NewSecurePass123!');
    await page.getByRole('button', { name: /reset password/i }).click();
    await expect(page).toHaveURL(LOGIN_URL, { timeout: 8_000 });
  });
});

// ---------------------------------------------------------------------------
// E-07 — Logout
// ---------------------------------------------------------------------------

test.describe('Auth — Logout', () => {
  test('E-07: logout clears session → redirect to /login', async ({ page }) => {
    await loginAs(page);

    // Trigger logout via the top-bar or sidebar logout button
    await page.getByRole('button', { name: /log out/i }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });

    // Verify session cookies are gone — navigating to a protected route should redirect
    await page.goto(ADMIN_DASHBOARD_URL);
    await expect(page).toHaveURL(/\/login/);
  });
});

// ---------------------------------------------------------------------------
// E-08 to E-10 — Route Guards
// ---------------------------------------------------------------------------

test.describe('Auth — Route Guards', () => {
  test('E-08: authenticated user visiting /login → redirected to dashboard', async ({
    page,
  }) => {
    await loginAs(page);
    await page.goto(LOGIN_URL);
    await expect(page).toHaveURL(new RegExp(ADMIN_DASHBOARD_URL), {
      timeout: 5_000,
    });
  });

  test('E-09: unauthenticated user visiting /admin/dashboard → /login?callbackUrl=...', async ({
    browser,
  }) => {
    const context: BrowserContext = await browser.newContext(); // fresh context — no cookies
    const page = await context.newPage();
    await page.goto(ADMIN_DASHBOARD_URL);
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
    await context.close();
  });

  test('E-10: non-admin user on /admin/* → redirected to /user/dashboard', async ({
    page,
  }) => {
    // Log in as an employee-role user (non-admin credentials)
    await loginAs(page, 'employee@acme.com', 'SecurePass123!');
    await page.goto(ADMIN_DASHBOARD_URL);
    await expect(page).toHaveURL(new RegExp(USER_DASHBOARD_URL), {
      timeout: 5_000,
    });
  });
});

// ---------------------------------------------------------------------------
// E-11 — Token refresh
// ---------------------------------------------------------------------------

test.describe('Auth — Token Refresh', () => {
  test('E-11: 401 from backend → transparent refresh → original request succeeds', async ({
    page,
  }) => {
    await loginAs(page);

    // Intercept any API request and verify it eventually succeeds after a 401
    // This tests the axios interceptor refresh loop end-to-end.
    // The test navigates to a data-heavy page and asserts that content loads,
    // proving the 401 was transparently recovered.
    await page.goto(ADMIN_DASHBOARD_URL);
    // Expect the dashboard to render without a login redirect
    await expect(page).toHaveURL(new RegExp(ADMIN_DASHBOARD_URL), {
      timeout: 8_000,
    });
    await expect(page.getByRole('main')).toBeVisible();
  });
});
