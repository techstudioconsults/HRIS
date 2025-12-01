import { test, expect } from '@playwright/test'

test.describe('Controller Dashboard - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set base URL for controller dashboard
    await page.goto('/')
  })

  test('should load dashboard page successfully', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('should have valid page structure', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check for basic HTML structure
    const html = page.locator('html')
    await expect(html).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Test different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('body')).toBeVisible()

    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()
  })
})
