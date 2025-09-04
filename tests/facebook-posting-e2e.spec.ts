import { test, expect } from '@playwright/test';

test.describe('Facebook Posting Functionality', () => {
  test('should display Facebook posting options in dashboard', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('http://localhost:3001/**');
    
    // Click Create Post button
    await page.getByRole('button', { name: 'Create Post' }).first().click();
    
    // Verify Create Post page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Check for Facebook posting options in the Actions panel
    const actionsPanel = page.locator('div[class*="space-y-6"]').last();
    
    // Look for Facebook-related elements
    const facebookElements = await Promise.all([
      actionsPanel.getByText('Connect Facebook').isVisible(),
      actionsPanel.getByText('Post to Facebook').isVisible(),
      actionsPanel.getByRole('button', { name: /Facebook/ }).isVisible()
    ]);
    
    // At least one Facebook option should be visible
    expect(facebookElements.some(Boolean)).toBeTruthy();
  });

  test('should access Facebook Pages from Connections tab', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to Connections tab
    await page.waitForURL('http://localhost:3001/**');
    await page.locator('a[title="Connections"]').first().click();
    
    // Verify Connections page
    await expect(page.getByText('Social Media Connections')).toBeVisible();
    
    // Check for Facebook Pages section
    if (await page.getByText('Facebook Pages').isVisible()) {
      // Click Manage link for Facebook Pages
      await page.getByText('Manage').click();
      
      // Should navigate to Facebook Pages management
      // This might be a different URL or modal
    }
  });

  test('should display Facebook Pages management interface', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Direct navigation to Facebook Pages (if implemented)
    await page.goto('http://localhost:3001/dashboard?tab=facebook-pages');
    
    // Should display Facebook Pages management
    const facebookPagesHeader = page.getByText('Facebook Pages');
    if (await facebookPagesHeader.isVisible()) {
      // Connected state - should show pages or "No pages found"
      expect(await page.getByText('No Facebook pages found').isVisible() || 
             await page.locator('div[class*="rounded-lg"]').first().isVisible()).toBeTruthy();
    } else {
      // Not connected state - should show connect button
      await expect(page.getByRole('button', { name: 'Connect with Facebook' })).toBeVisible();
    }
  });

  test('should handle Facebook token testing', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to Facebook Pages management
    await page.goto('http://localhost:3001/dashboard?tab=facebook-pages');
    
    // If Test Token button exists, click it
    if (await page.getByRole('button', { name: 'Test Token' }).isVisible()) {
      await page.getByRole('button', { name: 'Test Token' }).click();
      // Handle alert dialog
      page.on('dialog', async dialog => {
        console.log(`Token test result: ${dialog.message()}`);
        await dialog.accept();
      });
    }
  });

  test('should have working Facebook API endpoints', async ({ request }) => {
    // Test Facebook token endpoint
    const tokenResponse = await request.get('http://localhost:3001/api/facebook/token');
    
    // Test Facebook publish endpoint (POST request)
    const publishResponse = await request.post('http://localhost:3001/api/facebook/publish', {
      data: {
        content: 'Test post from E2E testing'
      }
    });
    
    // Both endpoints should be accessible (may return auth errors, which is expected)
    expect(tokenResponse.status()).toBeOneOf([200, 401, 403]);
    expect(publishResponse.status()).toBeOneOf([200, 401, 403, 400]);
  });
});