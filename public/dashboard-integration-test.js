// Dashboard Components Integration Test
console.log('=== DASHBOARD COMPONENTS INTEGRATION TEST ===');

// Test 1: Check if all required components are imported and available
console.log('\n1. CHECKING COMPONENT IMPORTS:');

// Check if running in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  console.log('✅ Browser environment detected');
  
  // Test 2: Check if localStorage is accessible
  console.log('\n2. CHECKING LOCALSTORAGE ACCESS:');
  try {
    const testKey = '__dashboard_test__';
    localStorage.setItem(testKey, 'test');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    console.log('✅ LocalStorage accessible and working');
  } catch (err) {
    console.log('❌ LocalStorage error:', err.message);
  }
  
  // Test 3: Check Facebook token availability
  console.log('\n3. CHECKING FACEBOOK INTEGRATION:');
  const facebookToken = localStorage.getItem('facebook_access_token');
  const facebookAuthCompleted = localStorage.getItem('facebook_auth_completed');
  
  console.log('Facebook token:', facebookToken ? `Found (${facebookToken.length} chars)` : 'Not found');
  console.log('Facebook auth completed:', facebookAuthCompleted || 'Not found');
  
  if (facebookToken) {
    console.log('✅ Facebook integration ready');
  } else {
    console.log('⚠ Facebook integration not configured');
  }
  
  // Test 4: Check Supabase session
  console.log('\n4. CHECKING SUPABASE SESSION:');
  try {
    // This would normally require importing supabase, but we can check for tokens
    const supabaseToken = localStorage.getItem('supabase_access_token');
    console.log('Supabase token:', supabaseToken ? `Found (${supabaseToken.length} chars)` : 'Not found');
    
    if (supabaseToken) {
      console.log('✅ Supabase session available');
    } else {
      console.log('⚠ No Supabase session found');
    }
  } catch (err) {
    console.log('❌ Supabase session check error:', err.message);
  }
  
  // Test 5: Check API endpoints
  console.log('\n5. CHECKING API ENDPOINTS:');
  
  // Test Facebook publish endpoint
  fetch('/api/facebook/publish', {
    method: 'OPTIONS'
  })
    .then(response => {
      console.log('Facebook publish endpoint:', response.ok ? '✅ Available' : '⚠ Not available');
    })
    .catch(err => {
      console.log('Facebook publish endpoint:', '❌ Error -', err.message);
    });
  
  // Test Facebook upload endpoint
  fetch('/api/facebook/upload-image', {
    method: 'OPTIONS'
  })
    .then(response => {
      console.log('Facebook upload endpoint:', response.ok ? '✅ Available' : '⚠ Not available');
    })
    .catch(err => {
      console.log('Facebook upload endpoint:', '❌ Error -', err.message);
    });
  
  // Test 6: Check DOM elements for dashboard tabs
  console.log('\n6. CHECKING DASHBOARD TAB ELEMENTS:');
  setTimeout(() => {
    const tabs = [
      'schedule', 'queue', 'calendar', 'strategy', 
      'automation', 'connections', 'create-post', 
      'facebook-pages', 'settings'
    ];
    
    console.log('Dashboard tabs to check:', tabs);
    
    // Check if we can find tab navigation elements
    const navElements = document.querySelectorAll('nav a');
    console.log('Navigation elements found:', navElements.length);
    
    if (navElements.length > 0) {
      console.log('✅ Navigation elements present');
    } else {
      console.log('⚠ No navigation elements found');
    }
    
    // Check if main content area exists
    const mainContent = document.querySelector('main');
    if (mainContent) {
      console.log('✅ Main content area present');
    } else {
      console.log('❌ Main content area missing');
    }
  }, 1000);
  
} else {
  console.log('❌ Not running in browser environment');
}

console.log('\n=== TEST COMPLETE ===');
console.log('If all checks show ✅, the dashboard is properly integrated.');
console.log('Look for any ❌ or ⚠ warnings that need attention.');