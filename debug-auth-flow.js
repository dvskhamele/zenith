const { chromium } = require('playwright');

async function debugAuthFlow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable logging
  page.on('console', msg => console.log('Page console:', msg.text()));
  page.on('request', request => console.log('Request:', request.method(), request.url()));
  page.on('response', response => console.log('Response:', response.status(), response.url()));

  try {
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
      
      // Check if we're on the Facebook pages page
      const currentUrl = page.url();
      console.log('Current URL after Facebook auth:', currentUrl);
      
      if (currentUrl.includes('/facebook-pages')) {
        console.log('Successfully redirected to Facebook pages page');
        await page.waitForTimeout(5000);
        
        // Check for access token in localStorage
        const accessToken = await page.evaluate(() => localStorage.getItem('facebook_access_token'));
        console.log('Access token in localStorage:', accessToken ? 'Found' : 'Not found');
        
        if (accessToken) {
          // Try to fetch pages
          console.log('Clicking Fetch Pages button...');
          await page.click('button:has-text("Fetch My Pages")');
          await page.waitForTimeout(5000);
        }
      }
    } else {
      console.log('Already logged in. Going to Facebook pages...');
      await page.goto('http://localhost:9999/facebook-pages');
      await page.waitForLoadState('networkidle');
      
      // Check for access token
      const accessToken = await page.evaluate(() => localStorage.getItem('facebook_access_token'));
      console.log('Access token in localStorage:', accessToken ? 'Found' : 'Not found');
    }
    
    console.log('Debug session completed. Browser will remain open.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAuthFlow().catch(console.error);