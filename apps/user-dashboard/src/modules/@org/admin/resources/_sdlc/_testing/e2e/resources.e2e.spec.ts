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

  test.todo('should display the Folders and Files tab headings');
  test.todo('should show root-level FolderCards on the Folders tab');
  test.todo('should create a new folder successfully');
  test.todo('should navigate into a folder and update the breadcrumb');
  test.todo('should navigate back to root via breadcrumb');
  test.todo('should upload a PDF to the HR Policies folder');
  test.todo('should display the uploaded file in the Files tab');
  test.todo('should delete an empty folder after confirming the dialog');
  test.todo('should show empty state when a folder has no sub-folders');
  test.todo('should show empty state when a folder has no files');
});
