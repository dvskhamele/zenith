// Debug script to check authentication state and localStorage tokens
console.log('=== AUTH STATE DEBUG ===');

// Check if we're in a browser environment
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('Browser environment detected');
  
  // Check localStorage for authentication tokens
  const facebookToken = localStorage.getItem('facebook_access_token');
  const authCompleted = localStorage.getItem('facebook_auth_completed');
  const supabaseToken = localStorage.getItem('supabase_access_token');
  const supabaseRefreshToken = localStorage.getItem('supabase_refresh_token');
  
  console.log('Facebook Access Token:', facebookToken ? `Found (length: ${facebookToken.length})` : 'Not found');
  console.log('Facebook Auth Completed:', authCompleted || 'Not found');
  console.log('Supabase Access Token:', supabaseToken ? `Found (length: ${supabaseToken.length})` : 'Not found');
  console.log('Supabase Refresh Token:', supabaseRefreshToken ? `Found (length: ${supabaseRefreshToken.length})` : 'Not found');
  
  // List all localStorage items
  console.log('\n=== ALL LOCALSTORAGE ITEMS ===');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null');
  }
  
  // Check for cookies
  console.log('\n=== COOKIES ===');
  console.log(document.cookie);
  
  // Test Supabase session if tokens exist
  if (supabaseToken) {
    console.log('\n=== TESTING SUPABASE SESSION ===');
    // This would require importing the Supabase client, but we can't do that in this context
    console.log('Supabase token found - would test session validity here');
  } else {
    console.log('\nNo Supabase token found');
  }
  
  // Test Facebook token if it exists
  if (facebookToken) {
    console.log('\n=== TESTING FACEBOOK TOKEN ===');
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${facebookToken}&fields=id,name,email`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log('Token test failed:', data.error);
        } else {
          console.log('Token is valid for user:', data.name);
        }
      })
      .catch(err => console.log('Token test error:', err));
  } else {
    console.log('\nNo Facebook token found. You need to connect your Facebook account first.');
  }
} else {
  console.log('Not in browser environment - cannot access localStorage or cookies');
}

// Simulate checking auth state in a React component
console.log('\n=== SIMULATING AUTH STATE CHECK ===');
console.log('This is what the AuthProvider would do:');
console.log('1. Check for existing session in localStorage');
console.log('2. Check for OAuth tokens');
console.log('3. If tokens found, try to restore session');
console.log('4. If no tokens, check for regular session');
console.log('5. Set loading to false when done');