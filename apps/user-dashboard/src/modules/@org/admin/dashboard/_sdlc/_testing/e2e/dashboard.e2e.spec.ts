import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const PAGE_URL = `${BASE_URL}/admin/dashboard`;

test.describe('Admin Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: set up auth session cookie or perform login before navigating
    await page.goto(PAGE_URL);
  });

  test('should load the dashboard page without errors', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/admin/dashboard'));
    // TODO: assert on the page heading once the UI is stable
  });

  test('should display headcount widget with numeric values', async ({
    page,
  }) => {
    // TODO: wait for skeleton to resolve and assert on metric values
    await expect(page.getByTestId('headcount-widget')).toBeVisible();
  });

  test.skip('should display all metric widgets after data loads', async () => {});
  test.skip('should display the onboarding banner for a new organisation', async () => {});
  test.skip('should not display the onboarding banner for a fully set-up organisation', async () => {});
  test.skip('should display skeleton loaders on initial page load', async () => {});
  test.skip('should navigate to the leave module when clicking pending leave approvals', async () => {});
  test.skip('should navigate to the payroll module when clicking the payroll summary widget', async () => {});
  test.skip('should show the recent activity feed with at least one item', async () => {});
  test.skip('should redirect to /login when the session has expired (401 response)', async () => {});
  test.skip('should be fully keyboard navigable without a mouse', async () => {});
  test.skip('should pass Axe accessibility audit on full render', async () => {});
});
