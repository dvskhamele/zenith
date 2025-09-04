// Simple script to restore Facebook token
console.log('=== RESTORE FACEBOOK TOKEN ===');

// This script should be run in the browser console
// Replace 'YOUR_FACEBOOK_TOKEN_HERE' with your actual Facebook token

function restoreFacebookToken(token) {
  if (!token || token.length < 50) {
    console.log('❌ Invalid token provided');
    return;
  }
  
  try {
    localStorage.setItem('facebook_access_token', token);
    localStorage.setItem('facebook_auth_completed', 'true');
    console.log('✅ Facebook token restored successfully!');
    console.log('Token length:', token.length);
    
    // Verify it was set
    const storedToken = localStorage.getItem('facebook_access_token');
    if (storedToken === token) {
      console.log('✅ Token verification successful');
    } else {
      console.log('❌ Token verification failed');
    }
  } catch (err) {
    console.log('❌ Error restoring token:', err.message);
  }
}

// Example usage (uncomment and replace with your actual token):
// restoreFacebookToken('YOUR_FACEBOOK_TOKEN_HERE');

console.log('To use this script:');
console.log('1. Get your Facebook token from https://developers.facebook.com/tools/explorer/');
console.log('2. Replace YOUR_FACEBOOK_TOKEN_HERE with your actual token');
console.log('3. Run the restoreFacebookToken() function with your token');
console.log('4. Refresh the page to see if the token persists');