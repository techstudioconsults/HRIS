import { test, expect } from '@playwright/test';

const LOGIN_URL = '/login';
const REGISTER_URL = '/register';
const FORGOT_URL = '/forgot-password';
const OTP_URL = '/login/otp';
const DASHBOARD_URL = '/admin/dashboard';

const VALID_EMAIL = 'amara@acme.com';
const VALID_PASSWORD = 'SecurePass123!';

test.describe('Auth — Password Login', () => {
  test('E-01: valid credentials → redirected to dashboard', async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);
    await page.getByLabel(/email/i).fill(VALID_EMAIL);
    await page.getByLabel(/password/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL), { timeout: 5000 });
  });

  test('E-02: invalid credentials show inline error', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('E-06: authenticated user visiting /login redirected to dashboard', async ({
    page,
    context,
  }) => {
    // Assumes auth state is set up via global auth fixture
    await page.goto(LOGIN_URL);
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL));
  });
});

test.describe('Auth — OTP Login', () => {
  test('E-03: OTP login golden path', async ({ page }) => {
    await page.goto(OTP_URL);
    await page.getByLabel(/email/i).fill(VALID_EMAIL);
    await page.getByRole('button', { name: /send otp/i }).click();
    await expect(page).toHaveURL(/otp-verify/);

    // Fill OTP digits
    const digits = page.locator('input[type="text"]');
    await digits.nth(0).fill('1');
    await digits.nth(1).fill('2');
    await digits.nth(2).fill('3');
    await digits.nth(3).fill('4');
    await digits.nth(4).fill('5');
    await digits.nth(5).fill('6');

    await page.getByRole('button', { name: /verify/i }).click();
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL), { timeout: 5000 });
  });
});

test.describe('Auth — Registration', () => {
  test('E-04: registration golden path', async ({ page }) => {
    await page.goto(REGISTER_URL);
    await page.getByLabel(/company name/i).fill('New Co');
    await page.getByLabel(/domain/i).fill('newco');
    await page.getByLabel(/first name/i).fill('Jane');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('jane@newco.com');
    await page.getByLabel(/^password$/i).fill('SecurePass123!');
    await page.getByLabel(/confirm password/i).fill('SecurePass123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(LOGIN_URL, { timeout: 5000 });
  });
});

test.describe('Auth — Forgot / Reset Password', () => {
  test('E-05: forgot password shows check-mail confirmation', async ({
    page,
  }) => {
    await page.goto(FORGOT_URL);
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByText(/check your/i)).toBeVisible();
  });
});

test.describe('Auth — Route Guards', () => {
  test('E-07: unauthenticated user visiting /admin/dashboard redirected to /login', async ({
    browser,
  }) => {
    const context = await browser.newContext(); // no auth state
    const page = await context.newPage();
    await page.goto(DASHBOARD_URL);
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });
});
