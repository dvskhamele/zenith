// FACEBOOK PAGES DEBUG TEST
// This will test the actual Facebook pages fetching

console.log('🔍 TESTING FACEBOOK PAGES FETCHING...');

// Test the FacebookService directly
(async () => {
  try {
    console.log('=== TESTING FACEBOOK SERVICE DIRECTLY ===');
    
    // Import the service dynamically
    const { facebookService } = await import('/Users/test/Startups/zenith/src/services/facebookService');
    
    console.log('1. Getting Facebook access token...');
    const token = await facebookService.getAccessToken();
    console.log('Token found:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 30) + '...');
    }
    
    console.log('2. Testing connection...');
    const connection = await facebookService.testConnection();
    console.log('Connection result:', connection);
    
    if (connection.connected) {
      console.log('3. Getting user profile...');
      const profile = await facebookService.getProfile();
      console.log('User profile:', profile.name);
      
      console.log('4. Getting Facebook pages...');
      const pages = await facebookService.getPages();
      console.log('Pages count:', pages.length);
      console.log('Pages data:', pages);
      
      if (pages.length > 0) {
        console.log('✅ SUCCESS: Pages found!');
        pages.forEach((page, index) => {
          console.log(`   ${index + 1}. ${page.name} (${page.category})`);
        });
      } else {
        console.log('❌ NO PAGES FOUND');
        console.log('This suggests either:');
        console.log('1. Token scope limitations');
        console.log('2. No pages connected to account');
        console.log('3. Facebook API returning empty');
      }
    } else {
      console.log('❌ NOT CONNECTED TO FACEBOOK');
    }
  } catch (error) {
    console.error('❌ ERROR IN FACEBOOK SERVICE TEST:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
})();

// Test the API endpoints directly
(async () => {
  try {
    console.log('\n=== TESTING API ENDPOINTS DIRECTLY ===');
    
    console.log('1. Testing /api/facebook/token endpoint...');
    const tokenResponse = await fetch('http://localhost:3001/api/facebook/token');
    const tokenData = await tokenResponse.json();
    console.log('Token API response:', tokenData);
    
    console.log('2. Testing /api/facebook/pages endpoint...');
    const pagesResponse = await fetch('http://localhost:3001/api/facebook/pages');
    const pagesData = await pagesResponse.json();
    console.log('Pages API response:', pagesData);
    
    if (pagesData.pages) {
      console.log('✅ PAGES API WORKING');
      console.log('Pages count:', pagesData.pages.length);
    } else {
      console.log('❌ PAGES API NOT RETURNING PAGES');
      console.log('Error:', pagesData.error);
    }
    
  } catch (error) {
    console.error('❌ ERROR IN API TEST:', error);
  }
})();

console.log('\n=== DEBUGGING COMPLETE ===');
console.log('Check the results above to see what\'s happening with your Facebook pages.');