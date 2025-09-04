// Check if Facebook token exists and is valid
console.log('=== FACEBOOK TOKEN CHECK ===');

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('Browser environment detected');
  
  // Check all localStorage items
  console.log('All localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null');
  }
  
  // Specifically check for Facebook token
  const facebookToken = localStorage.getItem('facebook_access_token');
  const facebookAuthCompleted = localStorage.getItem('facebook_auth_completed');
  
  console.log('\nFacebook specific items:');
  console.log('facebook_access_token:', facebookToken ? `Found (${facebookToken.length} chars)` : 'Not found');
  console.log('facebook_auth_completed:', facebookAuthCompleted || 'Not found');
  
  if (facebookToken) {
    console.log('\nToken preview:', facebookToken.substring(0, 100) + (facebookToken.length > 100 ? '...' : ''));
    
    // Test if token is still valid
    console.log('\nTesting token validity...');
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${facebookToken}&fields=id,name`)
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        if (data.error) {
          console.log('Token is invalid:', data.error);
        } else {
          console.log('Token is valid for user:', data.name);
        }
      })
      .catch(err => {
        console.log('Error testing token:', err);
      });
  } else {
    console.log('\nNo Facebook token found in localStorage');
  }
} else {
  console.log('Not in browser environment');
}