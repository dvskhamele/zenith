import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  
  // Expect the page title to contain "Zenith"
  await expect(page).toHaveTitle(/Zenith/);
});

test('homepage has workspace name', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  
  // Check that the workspace name is visible
  await expect(page.getByText('Test Workspace')).toBeVisible();
});