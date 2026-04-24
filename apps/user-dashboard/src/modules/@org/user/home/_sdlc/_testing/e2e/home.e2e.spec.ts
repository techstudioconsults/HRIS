import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const PAGE_URL = `${BASE_URL}/user/dashboard`;

test.describe('Home Employee E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('should load the employee home dashboard page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/user/'));
  });

  test.todo(
    'should display a personalised greeting with the employee first name'
  );
  test.todo('should render three quick-action cards on the active-user view');
  test.todo(
    'should navigate to /user/leave when the Request Leave quick-action is clicked'
  );
  test.todo(
    'should navigate to /user/payslip when the View Payslip quick-action is clicked'
  );
  test.todo('should render the recent activities feed on the active-user view');
  test.todo('should display the onboarding checklist for a new employee');
  test.todo(
    'should show progress header with correct completed/total steps on onboarding view'
  );
  test.todo(
    'should redirect to /auth/login when accessed without a valid session'
  );
});
