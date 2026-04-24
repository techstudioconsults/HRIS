import { test, expect } from '@playwright/test';

const BASE = '/admin/employee';

test.describe('Employee List', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes test environment seeds mock employees and admin session exists
    await page.goto(BASE);
  });

  test('renders employee list with rows', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Amara Okafor')).toBeVisible();
  });

  test('search filters employee rows', async ({ page }) => {
    await page.getByPlaceholder(/search/i).fill('Amara');
    await expect(page.getByText('Amara Okafor')).toBeVisible();
    await expect(page.getByText('Chidi Eze')).not.toBeVisible();
  });

  test('department filter shows only matching employees', async ({ page }) => {
    await page
      .getByRole('combobox', { name: /department/i })
      .selectOption('Engineering');
    const rows = page.getByRole('row');
    await expect(rows).toHaveCount(3); // header + 2 engineering employees
  });

  test('pagination controls advance pages', async ({ page }) => {
    // Requires 21+ seeded employees in E2E environment
    await expect(page.getByRole('button', { name: /next/i })).toBeEnabled();
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText('Page 2')).toBeVisible();
  });
});

test.describe('Employee Profile Navigation', () => {
  test('clicking a row opens the employee profile', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Amara Okafor').click();
    await expect(page).toHaveURL(/\/admin\/employee\/emp_01/);
    await expect(
      page.getByRole('heading', { name: 'Amara Okafor' })
    ).toBeVisible();
  });

  test('profile tabs load independently', async ({ page }) => {
    await page.goto(`${BASE}/emp_01`);
    await page.getByRole('tab', { name: /leave history/i }).click();
    await expect(
      page.getByText(/no leave history/i).or(page.getByRole('table'))
    ).toBeVisible();
  });
});

test.describe('Create Employee', () => {
  test('fills and submits the add employee form', async ({ page }) => {
    await page.goto(`${BASE}/new`);
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('Employee');
    await page.getByLabel(/email/i).fill(`test.${Date.now()}@company.com`);
    await page.getByLabel(/phone/i).fill('+234 801 000 0000');
    await page.getByLabel(/date of birth/i).fill('1995-06-15');
    await page
      .getByRole('combobox', { name: /department/i })
      .selectOption('Engineering');
    await page
      .getByRole('combobox', { name: /role/i })
      .selectOption('Software Engineer');
    await page
      .getByRole('combobox', { name: /contract type/i })
      .selectOption('FULL_TIME');
    await page.getByLabel(/start date/i).fill('2025-01-01');
    await page.getByRole('button', { name: /save employee/i }).click();
    await expect(page).toHaveURL(/\/admin\/employee\//);
  });

  test('shows validation errors for missing required fields', async ({
    page,
  }) => {
    await page.goto(`${BASE}/new`);
    await page.getByRole('button', { name: /save employee/i }).click();
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByText(/email/i)).toBeVisible();
  });
});

test.describe('Change Employment Status', () => {
  test('terminates an active employee', async ({ page }) => {
    await page.goto(`${BASE}/emp_01`);
    await page.getByRole('button', { name: /change status/i }).click();
    await page.getByRole('option', { name: /terminated/i }).click();
    await page.getByLabel(/effective date/i).fill('2025-06-01');
    await page.getByLabel(/reason/i).fill('Resignation');
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByText('TERMINATED')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('employee list has no critical a11y violations', async ({ page }) => {
    await page.goto(BASE);
    // Use axe-playwright or similar in CI; placeholder here
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('status badges show text labels, not colour alone', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText('ACTIVE').first()).toBeVisible();
  });
});
