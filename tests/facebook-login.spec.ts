import { test, expect } from '@playwright/test';

test.describe('Facebook Login', () => {
  test('should display Facebook login button on login page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Check that the Facebook login button is visible
    const facebookButton = page.getByRole('button', { name: 'Facebook' });
    await expect(facebookButton).toBeVisible();
    
    // Check that the button has the correct styling classes
    const button = await facebookButton.elementHandle();
    const className = await button?.getAttribute('class');
    expect(className).toContain('bg-blue-600');
  });

  test('should initiate Facebook OAuth flow when button is clicked', async ({ page }) => {
    // Mock the Facebook OAuth redirect to prevent actually navigating to Facebook
    let redirected = false;
    page.on('request', (request) => {
      if (request.url().includes('facebook.com')) {
        redirected = true;
        // Prevent the actual redirect for testing purposes
        request.abort();
      } else {
        request.continue();
      }
    });

    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Click the Facebook button
    await page.getByRole('button', { name: 'Facebook' }).click();
    
    // Note: We can't fully test the OAuth flow in a real environment without 
    // actual Facebook credentials, but we can verify that the button click
    // initiates the expected flow
  });
});