// tests/facebook-login.spec.js
const { test, expect } = require('@playwright/test');

test('should login via Facebook and navigate dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Click Facebook login button
  await page.click('button:has-text("Login with Facebook")');

  // Wait for Facebook login popup and handle login
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('button:has-text("Login with Facebook")'),
  ]);

  await popup.fill('#email', 'YOUR_FACEBOOK_EMAIL');
  await popup.fill('#pass', 'YOUR_FACEBOOK_PASSWORD');
  await popup.click('#loginbutton');

  // Wait for redirect back to dashboard
  await page.waitForURL('http://localhost:3000/dashboard');
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();

  // Simulate some user actions
  await page.click('button:has-text("Send Signal")');
});