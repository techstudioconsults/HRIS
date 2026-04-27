import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const PAGE_URL = `${BASE_URL}/admin/leave`;

test.describe('Leave Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('should load the leave admin page without errors', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/admin/leave'));
    await expect(page.getByRole('heading', { name: /leave/i })).toBeVisible();
  });

  test.skip('should display the leave request table with correct columns', async () => {});
  test.skip('should show pending requests by default on page load', async () => {});
  test.skip('should open the setup wizard for a new organisation with no leave types', async () => {});
  test.skip('should complete the setup wizard and show the leave dashboard', async () => {});
  test.skip('should filter requests to show only approved when approved filter is selected', async () => {});
  test.skip('should clear all filters when the reset filters button is clicked', async () => {});
  test.skip('should paginate to the next page of leave requests', async () => {});

  test.skip('should open the leave request detail drawer on row click', async () => {});
  test.skip('should display the employee leave balance inside the detail drawer', async () => {});
  test.skip('should approve a pending leave request and update the row status to Approved', async () => {});
  test.skip('should decline a leave request and require a reason before submission', async () => {});
  test.skip('should show an error if the decline reason is too short', async () => {});

  test.skip('should open the create leave type drawer from the leave types section', async () => {});
  test.skip('should create a new Maternity Leave type with 84 days annually', async () => {});
  test.skip('should edit an existing leave type allowance and save successfully', async () => {});
  test.skip('should archive a leave type and remove it from the active types list', async () => {});

  test.skip('should be fully keyboard navigable through the request table and drawer', async () => {});
  test.skip('should trap focus within the drawer while it is open', async () => {});
  test.skip('should return focus to the triggering row after closing the drawer', async () => {});
});
