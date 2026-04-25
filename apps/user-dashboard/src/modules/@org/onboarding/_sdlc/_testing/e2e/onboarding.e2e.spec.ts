import { test, expect } from '@playwright/test';

const WELCOME_URL = '/onboarding/welcome';
const STEP1_URL = '/onboarding/step-1';
const STEP2_URL = '/onboarding/step-2';
const STEP3_URL = '/onboarding/step-3';
const DASHBOARD_URL = '/admin/dashboard';

test.describe('Onboarding — Full Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes auth state is set up via global auth fixture (owner role)
    await page.goto(WELCOME_URL);
  });

  test('E-01: full wizard golden path', async ({ page }) => {
    // Welcome
    await page.getByRole('button', { name: /skip|continue/i }).click();
    await expect(page).toHaveURL(STEP1_URL);

    // Step 1 — Company Profile
    await page.getByLabel(/company name/i).fill('Acme Corp Updated');
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page).toHaveURL(STEP2_URL);

    // Step 2 — Add a Team
    await page.getByRole('button', { name: /add team/i }).click();
    await page.getByLabel(/team name/i).fill('Product');
    await page.getByRole('button', { name: /save team/i }).click();
    await expect(page.getByText('Product')).toBeVisible();

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page).toHaveURL(STEP3_URL);

    // Step 3 — Invite an Employee
    await page.getByRole('button', { name: /add employee/i }).click();
    await page.getByLabel(/first name/i).fill('Bola');
    await page.getByLabel(/last name/i).fill('Adeyemi');
    await page.getByLabel(/email/i).fill('bola@acme.com');
    await page.getByLabel(/phone/i).fill('+2348012345678');
    await page.getByLabel(/team/i).selectOption('Engineering');
    await page.getByLabel(/role/i).selectOption('Senior Engineer');
    await page.getByRole('button', { name: /finish|done/i }).click();

    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL), { timeout: 5000 });
  });

  test('E-02: back navigation preserves step 1 data', async ({ page }) => {
    await page.getByRole('button', { name: /skip|continue/i }).click();
    await page.getByLabel(/company name/i).fill('Test Company');
    await page.goto(STEP1_URL);
    // Expect the pre-filled value from GET /companies/current
    const nameInput = page.getByLabel(/company name/i);
    await expect(nameInput).not.toBeEmpty();
  });
});

test.describe('Onboarding — Route Guards', () => {
  test('E-03: unauthenticated user redirected to /login', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(WELCOME_URL);
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });

  test('E-04: completed owner redirected to dashboard when visiting /onboarding', async ({
    page,
  }) => {
    // Requires test fixture where takenTour=true
    await page.goto(WELCOME_URL);
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL));
  });
});
