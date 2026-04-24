import { test, expect } from '@playwright/test';

const BASE = '/user/leave';

test.describe('Leave Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('renders leave request history cards', async ({ page }) => {
    await expect(page.getByText('Annual Leave')).toBeVisible();
    await expect(page.getByText('Sick Leave')).toBeVisible();
  });

  test('shows status badges with text labels', async ({ page }) => {
    await expect(page.getByText('pending').first()).toBeVisible();
    await expect(page.getByText('approved').first()).toBeVisible();
    await expect(page.getByText('rejected').first()).toBeVisible();
  });
});

test.describe('Request Leave Flow', () => {
  test('opens request modal on button click', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: /leave type/i })
    ).toBeVisible();
  });

  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/please select a leave type/i)).toBeVisible();
    await expect(page.getByText(/please select a start date/i)).toBeVisible();
  });

  test('submits valid request and shows confirmation modal', async ({
    page,
  }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();

    await page
      .getByRole('combobox', { name: /leave type/i })
      .selectOption('Annual Leave');
    await page.getByLabel(/start date/i).fill('2025-08-01');
    await page.getByLabel(/end date/i).fill('2025-08-05');
    await page.getByLabel(/reason/i).fill('Annual vacation');

    await page.getByRole('button', { name: /submit/i }).click();

    await expect(
      page.getByRole('dialog', { name: /submitted/i })
    ).toBeVisible();
  });

  test('closes confirmation modal and refreshes list', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();
    await page
      .getByRole('combobox', { name: /leave type/i })
      .selectOption('Annual Leave');
    await page.getByLabel(/start date/i).fill('2025-09-01');
    await page.getByLabel(/end date/i).fill('2025-09-03');
    await page.getByLabel(/reason/i).fill('Short break');
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('Leave Details Modal', () => {
  test('opens details modal on card click', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Family vacation').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Annual Leave')).toBeVisible();
  });

  test('shows rejection reason for rejected requests', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Personal errand').click();
    await expect(page.getByText(/critical deadline/i)).toBeVisible();
  });

  test('shows Edit button for pending requests', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Family vacation').click();
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
  });

  test('does not show Edit button for approved requests', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Flu and fever').click();
    await expect(page.getByRole('button', { name: /edit/i })).not.toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('request modal is accessible', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();
    await expect(page.getByRole('dialog')).toHaveAttribute(
      'aria-modal',
      'true'
    );
  });

  test('status badges have text labels', async ({ page }) => {
    await page.goto(BASE);
    const pendingBadge = page.getByText('pending').first();
    await expect(pendingBadge).toBeVisible();
  });

  test('date pickers have accessible labels', async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole('button', { name: /request leave/i }).click();
    await expect(page.getByLabel(/start date/i)).toBeVisible();
    await expect(page.getByLabel(/end date/i)).toBeVisible();
  });
});
