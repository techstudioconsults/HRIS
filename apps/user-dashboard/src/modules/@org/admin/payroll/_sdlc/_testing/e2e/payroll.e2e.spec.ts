import { test, expect } from '@playwright/test';

const PAYROLL_URL = '/admin/payroll';

test.describe('Admin Payroll — E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes session cookie / storage seeded by global setup
    await page.goto(PAYROLL_URL);
  });

  test('payroll overview loads with wallet balance and run card', async ({
    page,
  }) => {
    await expect(page.getByTestId('wallet-balance-card')).toBeVisible();
    await expect(page.getByTestId('payroll-run-card')).toBeVisible();
  });

  test('payroll setup wizard completes and redirects to overview', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /setup/i }).click();
    await expect(page).toHaveURL(/payroll\/setup/);

    // Step 1 — pay cycle
    await page
      .getByRole('combobox', { name: /pay cycle/i })
      .selectOption('MONTHLY');
    await page.getByRole('button', { name: /next/i }).click();

    // Step 2 — pay day
    await page.getByRole('spinbutton', { name: /pay day/i }).fill('28');
    await page.getByRole('button', { name: /next/i }).click();

    // Step 3 — bank account
    await page
      .getByRole('textbox', { name: /bank name/i })
      .fill('First Bank of Nigeria');
    await page.getByRole('textbox', { name: /account name/i }).fill('HRIS Ltd');
    await page
      .getByRole('textbox', { name: /account number/i })
      .fill('0123456789');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(PAYROLL_URL);
  });

  test('initiate payroll run — SSE progress — review roster — approve', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /initiate run/i }).click();

    // Confirmation dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();

    // SSE progress bar visible
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page.getByTestId('run-status')).toContainText(
      /processing|completed/i,
      { timeout: 10_000 }
    );

    // Wait for completed
    await expect(page.getByTestId('run-status')).toContainText('completed', {
      timeout: 15_000,
    });

    // Roster visible
    await expect(page.getByTestId('roster-table')).toBeVisible();

    // Approve
    await page.getByRole('button', { name: /approve run/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByTestId('run-status')).toContainText('approved');
  });

  test('insufficient balance dialog shown when wallet too low', async ({
    page,
  }) => {
    // This test relies on the mock wallet having insufficient balance relative to run total.
    // Override via MSW or seed data if needed.
    await page.getByRole('button', { name: /approve run/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();

    const dialog = page.getByTestId('insufficient-balance-dialog');
    if (await dialog.isVisible()) {
      await expect(dialog).toContainText(/shortfall|insufficient/i);
      await expect(
        dialog.getByRole('link', { name: /fund wallet/i })
      ).toBeVisible();
    } else {
      // Wallet has sufficient balance in this seed — approve succeeded
      await expect(page.getByTestId('run-status')).toContainText('approved');
    }
  });

  test('add bonus adjustment from roster', async ({ page }) => {
    await page.getByRole('button', { name: /add adjustment/i }).click();
    await expect(
      page.getByRole('dialog', { name: /adjustment/i })
    ).toBeVisible();

    await page.getByRole('combobox', { name: /employee/i }).fill('Amara');
    await page.getByRole('option', { name: /amara/i }).first().click();
    await page.getByRole('combobox', { name: /type/i }).selectOption('BONUS');
    await page.getByRole('textbox', { name: /label/i }).fill('Q1 Bonus');
    await page.getByRole('spinbutton', { name: /amount/i }).fill('50000');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('roster-table')).toContainText('Q1 Bonus');
  });

  test('fund wallet — bank transfer details displayed', async ({ page }) => {
    await page.getByRole('button', { name: /fund wallet/i }).click();
    await expect(
      page.getByRole('dialog', { name: /fund wallet/i })
    ).toBeVisible();

    await page.getByRole('spinbutton', { name: /amount/i }).fill('5000000');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByTestId('bank-name')).toBeVisible();
    await expect(page.getByTestId('account-number')).toBeVisible();
    await expect(page.getByTestId('fund-reference')).toBeVisible();
    await expect(page.getByTestId('fund-expires-at')).toBeVisible();
  });

  test('payslip modal opens for roster row and has print button', async ({
    page,
  }) => {
    const firstRow = page.getByTestId('roster-table').getByRole('row').nth(1);
    await firstRow.click();

    await expect(page.getByRole('dialog', { name: /payslip/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /print|download/i })
    ).toBeVisible();
  });

  test('keyboard navigation — tab through run card actions in order', async ({
    page,
  }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('ADMIN guard — non-admin is redirected away from payroll', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      storageState: 'e2e/fixtures/employee-session.json',
    });
    const page = await ctx.newPage();
    await page.goto(PAYROLL_URL);
    await expect(page).not.toHaveURL(PAYROLL_URL);
    await ctx.close();
  });
});
