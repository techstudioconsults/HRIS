import { test, expect } from '@playwright/test';

/**
 * Example E2E test for web app
 * Place your actual E2E tests in this directory
 */

test.describe('Web App Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should load the landing page', async ({ page }) => {
    // Add your assertions here
    expect(page.url()).toContain('localhost');
  });

  test('should have proper title', async ({ page }) => {
    // Example: Check page title
    const title = await page.title();
    expect(title).toBeDefined();
  });
});
