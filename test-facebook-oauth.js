const { chromium } = require('playwright');

async function testFacebookOAuth() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:9999/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    console.log('Login page loaded');
    
    // Log network requests
    page.on('request', request => {
      console.log('Request:', request.method(), request.url());
    });
    
    page.on('response', response => {
      console.log('Response:', response.status(), response.url());
    });
    
    // Click the Facebook login button
    console.log('Clicking Facebook login button...');
    await page.click('button:has-text("Facebook")');
    
    // Wait for navigation
    console.log('Waiting for Facebook login page...');
    await page.waitForTimeout(5000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // If we're on Facebook's login page, try to login
    if (currentUrl.includes('facebook.com')) {
      console.log('On Facebook login page. Please login manually if needed.');
      console.log('Waiting for permissions dialog...');
      await page.waitForTimeout(10000);
    }
    
    // Continue with the flow
    console.log('Continuing with OAuth flow...');
    await page.waitForTimeout(5000);
    
    console.log('Test completed. Check if you were redirected back to your app.');
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    console.log('Test finished. Browser will remain open.');
  }
}

testFacebookOAuth().catch(console.error);