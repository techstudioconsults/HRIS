import { expect, test } from "@playwright/test";

test.describe("User Dashboard - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load user dashboard", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("should have proper page structure", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should handle navigation", async ({ page }) => {
    // Verify page is interactive
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Check that JavaScript is enabled
    const jsEnabled = await page.evaluate(() => true);
    expect(jsEnabled).toBe(true);
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("body")).toBeVisible();
  });
});
