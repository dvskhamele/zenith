const { chromium } = require('playwright');

async function debugFacebookLogin() {
  const browser = await chromium.launch({ headless: false }); // Set to true for headless mode
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:9999/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    console.log('Login page loaded');
    
    // Log all console messages
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });
    
    // Log network requests
    page.on('request', request => {
      console.log('Request:', request.method(), request.url());
    });
    
    page.on('response', response => {
      console.log('Response:', response.status(), response.url());
    });
    
    // Log page errors
    page.on('pageerror', error => {
      console.log('Page error:', error);
    });
    
    // Find and click the Facebook login button
    console.log('Looking for Facebook login button...');
    const facebookButton = await page.locator('button:has-text("Facebook")');
    
    if (await facebookButton.isVisible()) {
      console.log('Facebook button found, clicking...');
      await facebookButton.click();
      
      // Wait for navigation or popup
      console.log('Waiting for navigation or popup...');
      await page.waitForTimeout(5000);
      
      // Check if a new page was opened (popup)
      const pages = browser.contexts()[0].pages();
      console.log(`Number of pages: ${pages.length}`);
      
      if (pages.length > 1) {
        console.log('Popup detected, switching to popup...');
        const popup = pages[1];
        await popup.waitForLoadState('networkidle');
        console.log('Popup URL:', popup.url());
        
        // Log popup content
        const popupContent = await popup.content();
        console.log('Popup content length:', popupContent.length);
      } else {
        console.log('No popup detected, checking current page...');
        console.log('Current page URL:', page.url());
      }
    } else {
      console.log('Facebook button not found!');
      // Take a screenshot for debugging
      await page.screenshot({ path: 'login-page-error.png' });
      console.log('Screenshot saved as login-page-error.png');
    }
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('Test completed. Browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close the browser.');
    
    // Uncomment the following line if you want to automatically close the browser
    // await browser.close();
  }
}

debugFacebookLogin().catch(console.error);