import { test, expect } from '@playwright/test';

test.describe('Composer Page Functionality', () => {
  test('should allow text editing and template selection', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:9999/login');
    
    // Fill in the login form with test credentials
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:9999/**');
    
    // Navigate directly to the composer page using URL parameter
    await page.goto('http://localhost:9999/dashboard?page=composer');
    
    // Verify we're on the composer page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Find the content editable div and type some text
    const contentEditable = page.locator('div[contenteditable]').first();
    await contentEditable.fill('This is a test post for end-to-end testing');
    
    // Verify the text was entered
    await expect(contentEditable).toHaveText('This is a test post for end-to-end testing');
    
    // Click on Twitter template icon
    await page.getByTitle('Twitter Template').click();
    
    // Verify Twitter template is now selected
    await expect(page.getByTitle('Twitter Template')).toHaveCSS('background-color', 'rgb(14, 165, 233)'); // bg-sky-500
    await expect(page.getByText('Twitter Template')).toBeVisible();
    
    // Change the text again
    await contentEditable.fill('This is an updated test post with Twitter template');
    
    // Verify the text was updated
    await expect(contentEditable).toHaveText('This is an updated test post with Twitter template');
  });
  
  test('should navigate between dashboard sections', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:9999/login');
    
    // Fill in the login form with test credentials
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:9999/**');
    
    // Verify we're on the dashboard (calendar page by default)
    await expect(page.getByText('Calendar')).toBeVisible();
    
    // Navigate to the composer page using URL parameter
    await page.goto('http://localhost:9999/dashboard?page=composer');
    
    // Verify we're on the composer page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Navigate back to dashboard (calendar page)
    await page.goto('http://localhost:9999/dashboard?page=calendar');
    
    // Verify we're back on the dashboard
    await expect(page.getByText('Calendar')).toBeVisible();
  });
});