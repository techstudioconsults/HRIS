import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const PAGE_URL = `${BASE_URL}/admin/resources`;

test.describe('Resources E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('should load without errors', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/admin/resources'));
  });

  test.skip('should display the Folders and Files tab headings', async () => {});
  test.skip('should show root-level FolderCards on the Folders tab', async () => {});
  test.skip('should create a new folder successfully', async () => {});
  test.skip('should navigate into a folder and update the breadcrumb', async () => {});
  test.skip('should navigate back to root via breadcrumb', async () => {});
  test.skip('should upload a PDF to the HR Policies folder', async () => {});
  test.skip('should display the uploaded file in the Files tab', async () => {});
  test.skip('should delete an empty folder after confirming the dialog', async () => {});
  test.skip('should show empty state when a folder has no sub-folders', async () => {});
  test.skip('should show empty state when a folder has no files', async () => {});
});
