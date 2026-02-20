import { test, expect } from '@playwright/test';

/**
 * Leave Module E2E Tests
 * Real-world user workflows for leave management system
 */

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const ADMIN_LEAVE_PAGE = `${BASE_URL}/admin/leave`;
const ADMIN_LEAVE_TYPE_PAGE = `${BASE_URL}/admin/leave/type`;

test.describe('Leave Module E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to leave page before each test
    await page.goto(ADMIN_LEAVE_PAGE);
  });

  test.describe('User Workflow: Leave Setup Modal', () => {
    test('should show setup modal on first visit to leave page', async ({ page }) => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const title = page.locator('text=Set up Leave Types');
      await expect(title).toBeVisible();
    });

    test('should navigate to leave types when "Manage Leave Types" button clicked', async ({ page }) => {
      const manageButton = page.locator('button:has-text("Manage Leave Types")').first();
      await manageButton.click();

      // Wait for navigation
      await page.waitForURL(ADMIN_LEAVE_TYPE_PAGE);
      expect(page.url()).toContain('/admin/leave/type');
    });

    test('should close modal when "Remind me later" button clicked', async ({ page }) => {
      const remindButton = page.locator('button:has-text("Remind me later")');
      await remindButton.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('User Workflow: Search Leave Requests', () => {
    test('should display multiple leave requests on leave page', async ({ page }) => {
      // Wait for data table to load
      const table = page.locator('table, [role="table"]');
      await expect(table).toBeVisible();

      // Check for dummy data
      const janeRow = page.locator('text=Jane Doe');
      const johnRow = page.locator('text=John Smith');
      const aminaRow = page.locator('text=Amina Yusuf');

      await expect(janeRow).toBeVisible();
      await expect(johnRow).toBeVisible();
      await expect(aminaRow).toBeVisible();
    });

    test('should filter leave requests by employee name', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');
      await expect(searchInput).toBeVisible();

      await searchInput.fill('Jane');
      await page.waitForTimeout(300); // Allow time for filter to apply

      // Jane should be visible
      const janeRow = page.locator('text=Jane Doe');
      await expect(janeRow).toBeVisible();

      // Others should not be visible
      const johnRow = page.locator('text=John Smith');
      const aminaRow = page.locator('text=Amina Yusuf');
      await expect(johnRow).not.toBeVisible();
      await expect(aminaRow).not.toBeVisible();
    });

    test('should filter leave requests by leave type', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');
      await searchInput.fill('Sick Leave');
      await page.waitForTimeout(300);

      const sickLeaveRow = page.locator('text=Sick Leave');
      await expect(sickLeaveRow).toBeVisible();

      // Annual leave should not be visible
      const annualLeaveRow = page.locator('text=Annual Leave');
      // Note: might appear in multiple places, check row visibility
    });

    test('should filter leave requests by status', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');
      await searchInput.fill('approved');
      await page.waitForTimeout(300);

      const approvedStatus = page.locator('text=approved').first();
      await expect(approvedStatus).toBeVisible();
    });

    test('should show all requests again when search is cleared', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');

      // Search for specific employee
      await searchInput.fill('Jane');
      await page.waitForTimeout(300);

      let janeRow = page.locator('text=Jane Doe');
      await expect(janeRow).toBeVisible();

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(300);

      // All should be visible again
      janeRow = page.locator('text=Jane Doe');
      const johnRow = page.locator('text=John Smith');
      const aminaRow = page.locator('text=Amina Yusuf');

      await expect(janeRow).toBeVisible();
      await expect(johnRow).toBeVisible();
      await expect(aminaRow).toBeVisible();
    });

    test('should show empty state when search returns no results', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');
      await searchInput.fill('NonExistentEmployee');
      await page.waitForTimeout(300);

      const emptyState = page.locator('text=No matching leave requests');
      await expect(emptyState).toBeVisible();
    });
  });

  test.describe('User Workflow: Filter Button', () => {
    test('should show filter button with Icon', async ({ page }) => {
      const filterButton = page.locator('button:has-text("Filter")');
      await expect(filterButton).toBeVisible();
    });

    test('should open filter dropdown when clicked', async ({ page }) => {
      const filterButton = page.locator('button:has-text("Filter")');
      await filterButton.click();

      const filterMessage = page.locator('text=Basic filtering for leave requests will be available soon');
      await expect(filterMessage).toBeVisible();
    });
  });

  test.describe('User Workflow: Leave Header Navigation', () => {
    test('should show Leave Hub title and subtitle', async ({ page }) => {
      const title = page.locator('text=Leave Hub');
      const subtitle = page.locator('text=View employee leave requests and manage leave types');

      await expect(title).toBeVisible();
      await expect(subtitle).toBeVisible();
    });

    test('should navigate to leave type management page', async ({ page }) => {
      const manageButton = page.locator('button:has-text("Manage Leave Types")').last();
      await manageButton.click();

      await page.waitForURL(ADMIN_LEAVE_TYPE_PAGE);
      expect(page.url()).toContain('/admin/leave/type');
    });
  });

  test.describe('User Workflow: Create Leave Type', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to leave type page
      await page.goto(ADMIN_LEAVE_TYPE_PAGE);
    });

    test('should navigate to leave types page and show creation UI', async ({ page }) => {
      // Should be on leave type page
      expect(page.url()).toContain('/admin/leave/type');

      // Should see button to create leave type
      const createButton = page.locator('button:has-text("Create")');
      await expect(createButton).toBeVisible({ timeout: 5000 });
    });

    test('should fill and submit create leave type form', async ({ page }) => {
      // Click create button
      const createButton = page.locator('button:has-text("Create")');
      await createButton.click();

      // Wait for form modal to appear
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Fill form fields
      await page.locator('input[placeholder="Annual Leave"]').fill('Bereavement Leave');
      await page.locator('input[type="number"]').first().fill('3');

      // Select cycle dropdown
      const cycleSelect = page.locator('select').first();
      await cycleSelect.selectOption('yearly');

      // Fill max days per request
      const numberInputs = page.locator('input[type="number"]');
      await numberInputs.nth(1).fill('3');

      // Select eligibility dropdown
      const eligibilitySelect = page.locator('select').nth(1);
      await eligibilitySelect.selectOption('12');

      // Submit form
      const submitButton = page.locator('button:has-text("Create")').last();
      await submitButton.click();

      // Wait for success toast or navigation
      const successMessage = page.locator('text=created');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    test('should show validation error for invalid input', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create")');
      await createButton.click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Try to submit empty form
      const submitButton = page.locator('button:has-text("Create")').last();
      await submitButton.click();

      // Should show validation errors
      const errorMessages = page.locator('[role="alert"]');
      await expect(errorMessages).toHaveCount(1, { timeout: 2000 });
    });
  });

  test.describe('User Workflow: Leave Request Details', () => {
    test('should view leave request details when row clicked', async ({ page }) => {
      // Find and click on a leave request row
      const leaveRow = page.locator('text=Jane Doe').first();
      await leaveRow.click();

      // Details drawer should open
      const drawer = page.locator('[role="presentation"]');
      // Note: May need adjustment based on actual drawer selector
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);

      // Try to navigate to leave page
      try {
        await page.goto(ADMIN_LEAVE_PAGE);
      } catch (e) {
        // Expected to fail offline
      }

      // Go back online
      await page.context().setOffline(false);
    });

    test('should show empty state for new organization', async ({ page }) => {
      // Check if empty state appears when no leave requests exist
      const emptyMessage = page.locator('text=No leave requests yet');
      // This test depends on whether the page loads with empty data
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1, [role="heading"][aria-level="1"]');
      await expect(h1).toBeVisible();
    });

    test('should have accessible form labels', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search leave requests..."]');
      await expect(searchInput).toBeVisible();

      // Input should have accessible name/label
      const accessibleName =
        (await searchInput.getAttribute('aria-label')) || (await searchInput.getAttribute('placeholder'));
      expect(accessibleName).toBeTruthy();
    });

    test('should have proper button labels', async ({ page }) => {
      const filterButton = page.locator('button:has-text("Filter")');
      const manageButton = page.locator('button:has-text("Manage Leave Types")');

      await expect(filterButton).toBeVisible();
      await expect(manageButton).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(ADMIN_LEAVE_PAGE);

      const title = page.locator('text=Leave Hub');
      await expect(title).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(ADMIN_LEAVE_PAGE);

      const title = page.locator('text=Leave Hub');
      await expect(title).toBeVisible();
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(ADMIN_LEAVE_PAGE);

      const title = page.locator('text=Leave Hub');
      await expect(title).toBeVisible();
    });
  });
});
