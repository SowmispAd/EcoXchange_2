import { test, expect } from '@playwright/test';

test.describe('EcoXchange End-to-End Tests', () => {
  
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EcoXchange/);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    const heading = page.locator('text=Welcome Back');
    await expect(heading).toBeVisible();
  });
  
});
