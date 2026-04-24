import { test, expect } from '@playwright/test';

const PAYSLIP_URL = '/user/payslip';

test.describe('User Payslip — E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes global auth setup injects a valid session cookie
    await page.goto(PAYSLIP_URL);
  });

  test('E-01: authenticated employee sees payslip grid', async ({ page }) => {
    await expect(page.getByText('June 2025')).toBeVisible();
    await expect(page.getByText('May 2025')).toBeVisible();
  });

  test('E-02: summary card shows latest net pay', async ({ page }) => {
    const summaryCard = page.getByLabel('Latest net pay');
    await expect(summaryCard).toBeVisible();
    await expect(summaryCard).toContainText('450');
  });

  test('E-03: opens payslip detail modal and views breakdown', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'View' }).first().click();

    await expect(page.getByText('Basic Salary')).toBeVisible();
    await expect(page.getByText('PAYE Tax')).toBeVisible();
    await expect(page.getByText('Pension (Employee)')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('E-04: Escape closes the modal', async ({ page }) => {
    await page.getByRole('button', { name: 'View' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('E-05: download button initiates PDF download', async ({ page }) => {
    await page.getByRole('button', { name: 'View' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/payslip.*\.pdf/i);
  });

  test('E-06: unauthenticated user is redirected to login', async ({
    browser,
  }) => {
    const context = await browser.newContext(); // no auth cookies
    const page = await context.newPage();
    await page.goto(PAYSLIP_URL);
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });

  test('E-07: empty state shown for employee with no payslips', async ({
    page,
  }) => {
    // Requires test fixture: employee with no payslips in the DB / MSW
    await page.route('**/api/v1/payslips*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: [],
          pagination: { total: 0, page: 1, size: 20, totalPages: 0 },
        }),
      })
    );
    await page.reload();
    await expect(page.getByText('No payslips available yet.')).toBeVisible();
  });
});
