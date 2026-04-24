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

  test.todo('should display the leave request table with correct columns');
  test.todo('should show pending requests by default on page load');
  test.todo(
    'should open the setup wizard for a new organisation with no leave types'
  );
  test.todo('should complete the setup wizard and show the leave dashboard');

  test.todo(
    'should filter requests to show only approved when approved filter is selected'
  );
  test.todo(
    'should clear all filters when the reset filters button is clicked'
  );
  test.todo('should paginate to the next page of leave requests');

  test.todo('should open the leave request detail drawer on row click');
  test.todo(
    'should display the employee leave balance inside the detail drawer'
  );
  test.todo(
    'should approve a pending leave request and update the row status to Approved'
  );
  test.todo(
    'should decline a leave request and require a reason before submission'
  );
  test.todo('should show an error if the decline reason is too short');

  test.todo(
    'should open the create leave type drawer from the leave types section'
  );
  test.todo('should create a new Maternity Leave type with 84 days annually');
  test.todo(
    'should edit an existing leave type allowance and save successfully'
  );
  test.todo(
    'should archive a leave type and remove it from the active types list'
  );

  test.todo(
    'should be fully keyboard navigable through the request table and drawer'
  );
  test.todo('should trap focus within the drawer while it is open');
  test.todo(
    'should return focus to the triggering row after closing the drawer'
  );
});
