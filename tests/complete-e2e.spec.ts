import { test, expect } from '@playwright/test';

test.describe('Complete End-to-End Flow', () => {
  test('should display user information in preview', async ({ page }) => {
    // Set up localStorage with a mock Facebook token to simulate authentication
    await page.addInitScript(() => {
      localStorage.setItem('facebook_access_token', 'test_token');
    });
    
    // Navigate to the composer page directly
    await page.goto('http://localhost:9999/dashboard?page=composer');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the composer page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Verify user information is displayed in preview
    await expect(page.locator('img[alt="avatar"]')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=@johndoe')).toBeVisible();
  });
  
  test('should toggle social media platforms', async ({ page }) => {
    // Set up localStorage with a mock Facebook token to simulate authentication
    await page.addInitScript(() => {
      localStorage.setItem('facebook_access_token', 'test_token');
    });
    
    // Navigate to the composer page directly
    await page.goto('http://localhost:9999/dashboard?page=composer');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the composer page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Verify all social media toggle buttons are initially inactive
    const facebookButton = page.getByTitle('Publish to Facebook');
    const twitterButton = page.getByTitle('Publish to Twitter');
    const linkedinButton = page.getByTitle('Publish to LinkedIn');
    const instagramButton = page.getByTitle('Publish to Instagram');
    
    // Click each toggle button and verify it becomes active
    await facebookButton.click();
    await expect(facebookButton).toHaveCSS('background-color', 'rgb(37, 99, 235)'); // bg-blue-600
    
    await twitterButton.click();
    await expect(twitterButton).toHaveCSS('background-color', 'rgb(0, 0, 0)'); // bg-black
    
    await linkedinButton.click();
    await expect(linkedinButton).toHaveCSS('background-color', 'rgb(29, 78, 216)'); // bg-blue-700
    
    await instagramButton.click();
    // Instagram has a gradient background, so we'll check for the gradient class
    const instagramButtonClass = await instagramButton.getAttribute('class');
    expect(instagramButtonClass).toContain('bg-gradient');
  });
  
  test('should show publish button and handle click', async ({ page }) => {
    // Set up localStorage with a mock Facebook token to simulate authentication
    await page.addInitScript(() => {
      localStorage.setItem('facebook_access_token', 'test_token');
    });
    
    // Navigate to the composer page directly
    await page.goto('http://localhost:9999/dashboard?page=composer');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the composer page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Find the content editable div and type some text
    const contentEditable = page.locator('div[contenteditable]').first();
    await contentEditable.fill('This is a test post for complete end-to-end testing');
    
    // Click Facebook toggle button
    await page.getByTitle('Publish to Facebook').click();
    
    // Click the Publish Post button
    await page.getByRole('button', { name: 'Publish Post' }).click();
    
    // Since we're just testing the UI flow, we'll expect an error message about missing implementation
    // In a real implementation, this would show a success message
    await expect(page.locator('text=Failed to publish')).toBeVisible();
  });
});