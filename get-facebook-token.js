const { chromium } = require('playwright');

async function getFacebookToken() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Enable logging
    page.on('console', msg => console.log('Page console:', msg.text()));
    page.on('request', request => console.log('Request:', request.method(), request.url()));
    page.on('response', response => console.log('Response:', response.status(), response.url()));
    
    // Go to the app
    console.log('Navigating to app...');
    await page.goto('http://localhost:9999');
    
    // Wait for load
    await page.waitForLoadState('networkidle');
    
    // Check if we're logged in
    const loginButton = await page.$('text=Sign In');
    if (loginButton) {
      console.log('Not logged in. Going to login page...');
      await page.goto('http://localhost:9999/login');
      await page.waitForLoadState('networkidle');
      
      // Click Facebook login
      console.log('Clicking Facebook login...');
      await page.click('button:has-text("Facebook")');
      
      console.log('Please complete the Facebook login and permissions flow manually.');
      console.log('After completion, the browser will redirect back to your app.');
      await page.waitForTimeout(15000);
    }
    
    // Try to get the access token
    console.log('Attempting to get Facebook access token...');
    await page.goto('http://localhost:9999/facebook-pages');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for token retrieval
    await page.waitForTimeout(5000);
    
    console.log('Check the browser console for token information.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('Test completed.');
  }
}

getFacebookToken().catch(console.error);