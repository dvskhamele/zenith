// Test Facebook token validation
console.log('=== FACEBOOK TOKEN VALIDATION TEST ===');

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const token = localStorage.getItem('facebook_access_token');
  
  if (token) {
    console.log('Found Facebook token, testing validation...');
    
    // Test basic validation (me endpoint)
    console.log('Testing basic validation...');
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name`)
      .then(response => {
        console.log('Basic validation response status:', response.status);
        return response.json();
      })
      .then(data => {
        if (data.error) {
          console.log('❌ Basic validation failed:', data.error);
        } else {
          console.log('✅ Basic validation passed for user:', data.name);
        }
        
        // Test debug token endpoint
        console.log('Testing debug token endpoint...');
        fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`)
          .then(response => {
            console.log('Debug token response status:', response.status);
            return response.json();
          })
          .then(debugData => {
            if (debugData.error) {
              console.log('❌ Debug token failed:', debugData.error);
            } else {
              console.log('✅ Debug token successful');
              console.log('Token info:', debugData.data);
              if (debugData.data && debugData.data.scopes) {
                console.log('Token scopes:', debugData.data.scopes);
              }
            }
          })
          .catch(err => {
            console.log('Error with debug token:', err);
          });
      })
      .catch(err => {
        console.log('Error with basic validation:', err);
      });
  } else {
    console.log('❌ No Facebook token found in localStorage');
  }
} else {
  console.log('Not in browser environment');
}