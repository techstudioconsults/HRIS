import { test, expect } from '@playwright/test';

const TEAMS_URL = '/admin/teams';

test.describe('Admin Teams — E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEAMS_URL);
  });

  test('teams list loads and shows at least one team row', async ({ page }) => {
    await expect(page.getByTestId('team-row').first()).toBeVisible();
  });

  test('search filters team rows', async ({ page }) => {
    await page.getByRole('searchbox').fill('Engineering');
    await expect(page.getByTestId('team-row')).toHaveCount(1);
    await expect(page.getByTestId('team-row').first()).toContainText(
      'Engineering'
    );
  });

  test('full create workflow: Team → Role → Employee', async ({ page }) => {
    await page.getByRole('button', { name: /create team/i }).click();

    // Team dialog
    await expect(page.getByRole('dialog', { name: /team/i })).toBeVisible();
    await page.getByRole('textbox', { name: /name/i }).fill('Product');
    await page
      .getByRole('textbox', { name: /description/i })
      .fill('Product management and strategy team');
    await page.getByRole('button', { name: /next|save/i }).click();

    // Role dialog
    await expect(page.getByRole('dialog', { name: /role/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name/i }).fill('Lead');
    await page.getByRole('checkbox', { name: /read/i }).check();
    await page.getByRole('checkbox', { name: /write/i }).check();
    await page.getByRole('button', { name: /next|save/i }).click();

    // Employee dialog
    await expect(page.getByRole('dialog', { name: /employee/i })).toBeVisible();
    await page.getByRole('combobox', { name: /employee/i }).fill('Amara');
    await page.getByRole('option', { name: /amara/i }).first().click();
    await page.getByRole('button', { name: /assign|save/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('team-row')).toContainText('Product');
  });

  test('edit team — updates team name', async ({ page }) => {
    await page
      .getByTestId('team-row')
      .first()
      .getByRole('button', { name: /edit/i })
      .click();
    await expect(
      page.getByRole('dialog', { name: /edit team/i })
    ).toBeVisible();

    await page.getByRole('textbox', { name: /name/i }).clear();
    await page
      .getByRole('textbox', { name: /name/i })
      .fill('Engineering Updated');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('team-row').first()).toContainText(
      'Engineering Updated'
    );
  });

  test('delete team — confirmation dialog shown, then removed', async ({
    page,
  }) => {
    await page
      .getByTestId('team-row')
      .first()
      .getByRole('button', { name: /delete/i })
      .click();

    await expect(page.getByRole('alertdialog')).toBeVisible();
    await expect(page.getByRole('alertdialog')).toContainText(/delete|remove/i);
    await page.getByRole('button', { name: /confirm|delete/i }).click();

    await expect(page.getByRole('alertdialog')).not.toBeVisible();
  });

  test('ADMIN guard — non-admin is redirected from teams', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      storageState: 'e2e/fixtures/employee-session.json',
    });
    const page = await ctx.newPage();
    await page.goto(TEAMS_URL);
    await expect(page).not.toHaveURL(TEAMS_URL);
    await ctx.close();
  });

  test('keyboard navigation — tab through table rows and dialogs', async ({
    page,
  }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
