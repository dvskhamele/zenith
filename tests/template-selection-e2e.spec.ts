import { test, expect } from '@playwright/test';

test.describe('Template Selection Feature', () => {
  test('should display template selection icons and functionality', async ({ page }) => {
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
    
    // Check that template selection icons are visible
    await expect(page.getByTitle('Normal Text')).toBeVisible();
    await expect(page.getByTitle('Twitter Template')).toBeVisible();
    await expect(page.getByTitle('Instagram Template')).toBeVisible();
    await expect(page.getByTitle('LinkedIn Template')).toBeVisible();
    
    // Check that initially no template is selected (normal text mode)
    await expect(page.getByTitle('Normal Text')).toHaveCSS('background-color', 'rgb(14, 165, 233)'); // bg-sky-500
    
    // Click on Twitter template icon
    await page.getByTitle('Twitter Template').click();
    
    // Verify Twitter template is now selected
    await expect(page.getByTitle('Twitter Template')).toHaveCSS('background-color', 'rgb(14, 165, 233)'); // bg-sky-500
    await expect(page.getByText('Twitter Template')).toBeVisible();
    
    // Click on Instagram template icon
    await page.getByTitle('Instagram Template').click();
    
    // Verify Instagram template is now selected
    await expect(page.getByTitle('Instagram Template')).toHaveCSS('background-color', 'rgb(14, 165, 233)'); // bg-sky-500
    await expect(page.getByText('Instagram Template')).toBeVisible();
    
    // Click on LinkedIn template icon
    await page.getByTitle('LinkedIn Template').click();
    
    // Verify LinkedIn template is now selected
    await expect(page.getByTitle('LinkedIn Template')).toHaveCSS('background-color', 'rgb(14, 165, 235)'); // bg-sky-500
    await expect(page.getByText('LinkedIn Template')).toBeVisible();
    
    // Click on Normal Text icon to go back to normal mode
    await page.getByTitle('Normal Text').click();
    
    // Verify normal text mode is selected
    await expect(page.getByTitle('Normal Text')).toHaveCSS('background-color', 'rgb(14, 165, 233)'); // bg-sky-500
  });

  test('should display appropriate sharing options based on template selection', async ({ page }) => {
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
    
    // In normal text mode, verify that image sharing options are NOT visible
    await expect(page.getByTitle('Share image on Twitter')).not.toBeVisible();
    await expect(page.getByTitle('Share image on Instagram')).not.toBeVisible();
    await expect(page.getByTitle('Share image on Facebook')).not.toBeVisible();
    await expect(page.getByTitle('Share image on LinkedIn')).not.toBeVisible();
    
    // Click on Twitter template icon
    await page.getByTitle('Twitter Template').click();
    
    // Verify that image sharing options ARE now visible
    await expect(page.getByTitle('Share image on Twitter')).toBeVisible();
    await expect(page.getByTitle('Share image on Instagram')).toBeVisible();
    await expect(page.getByTitle('Share image on Facebook')).toBeVisible();
    await expect(page.getByTitle('Share image on LinkedIn')).toBeVisible();
    
    // Verify that text sharing options are always visible
    await expect(page.getByTitle('Share text on Twitter')).toBeVisible();
    await expect(page.getByTitle('Share text on LinkedIn')).toBeVisible();
    await expect(page.getByTitle('Share text on Facebook')).toBeVisible();
  });

  test('should allow downloading images and sharing content', async ({ page }) => {
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
    
    // Verify download button is visible
    await expect(page.getByRole('button', { name: 'Download Image' })).toBeVisible();
    
    // Click on Twitter template icon
    await page.getByTitle('Twitter Template').click();
    
    // Verify download button is still visible
    await expect(page.getByRole('button', { name: 'Download Image' })).toBeVisible();
    
    // Verify text sharing buttons are visible
    await expect(page.getByTitle('Share text on Twitter')).toBeVisible();
    await expect(page.getByTitle('Share text on LinkedIn')).toBeVisible();
    await expect(page.getByTitle('Share text on Facebook')).toBeVisible();
    
    // Verify image sharing buttons are visible
    await expect(page.getByTitle('Share image on Twitter')).toBeVisible();
    await expect(page.getByTitle('Share image on Instagram')).toBeVisible();
    await expect(page.getByTitle('Share image on Facebook')).toBeVisible();
    await expect(page.getByTitle('Share image on LinkedIn')).toBeVisible();
  });
});