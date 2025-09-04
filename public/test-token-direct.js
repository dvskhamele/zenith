// Test Facebook token with specific endpoints
console.log('=== FACEBOOK TOKEN DIRECT TEST ===');

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const token = localStorage.getItem('facebook_access_token');
  
  if (token) {
    console.log('Found Facebook token, testing specific endpoints...');
    
    // Test 1: Basic user info (lightweight call)
    console.log('Test 1: Basic user info...');
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log('❌ Test 1 failed:', data.error);
        } else {
          console.log('✅ Test 1 passed - User:', data.name);
        }
        
        // Test 2: Pages list (if Test 1 passed)
        if (!data.error) {
          console.log('Test 2: Pages list...');
          // Use a small limit to reduce load
          fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}&fields=name,id&limit=3`)
            .then(response => response.json())
            .then(pagesData => {
              if (pagesData.error) {
                if (pagesData.error.code === 4) {
                  console.log('⚠️ Test 2 hit rate limit - this is expected');
                  console.log('But token is likely valid - rate limit is temporary');
                } else {
                  console.log('❌ Test 2 failed:', pagesData.error);
                }
              } else {
                console.log('✅ Test 2 passed - Found', pagesData.data ? pagesData.data.length : 0, 'pages');
              }
            })
            .catch(err => {
              console.log('Error in Test 2:', err);
            });
        }
      })
      .catch(err => {
        console.log('Error in Test 1:', err);
      });
      
    // Test 3: Token debug info (if you want to risk it)
    console.log('Test 3: Token debug (may hit rate limit)...');
    fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`)
      .then(response => response.json())
      .then(debugData => {
        if (debugData.error) {
          if (debugData.error.code === 4) {
            console.log('⚠️ Test 3 hit rate limit - this is expected');
            console.log('Token is likely valid, just rate limited');
          } else {
            console.log('❌ Test 3 failed:', debugData.error);
          }
        } else {
          console.log('✅ Test 3 passed');
          console.log('Token expires:', new Date(debugData.data.expires_at * 1000));
        }
      })
      .catch(err => {
        console.log('Error in Test 3:', err);
      });
  } else {
    console.log('❌ No Facebook token found');
  }
} else {
  console.log('Not in browser environment');
}