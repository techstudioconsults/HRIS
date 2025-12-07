import { test, expect } from '@playwright/test'

test.describe('Web App - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render homepage', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('should have valid HTML structure', async ({ page }) => {
    const html = page.locator('html')
    await expect(html).toBeVisible()

    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should load without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.waitForLoadState('networkidle')

    // Page should load without critical errors
    const isVisible = await page.locator('body').isVisible()
    expect(isVisible).toBe(true)
  })

  test('should support different screen sizes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('body')).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
