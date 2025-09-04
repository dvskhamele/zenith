// Simple test to verify Facebook token and pages
console.log('=== FACEBOOK INTEGRATION TEST ===');

// Check if running in browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('Running in browser environment');
  
  // Check for Facebook token
  const token = localStorage.getItem('facebook_access_token');
  console.log('Facebook token found:', !!token);
  
  if (token) {
    console.log('Token length:', token.length);
    
    // Test token validity
    console.log('Testing token validity...');
    fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name`)
      .then(response => {
        console.log('Token validation response status:', response.status);
        return response.json();
      })
      .then(data => {
        if (data.error) {
          console.log('Token invalid:', data.error);
        } else {
          console.log('Token valid for user:', data.name);
          
          // Test pages access
          console.log('Testing pages access...');
          fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}&fields=name,id`)
            .then(response => {
              console.log('Pages access response status:', response.status);
              return response.json();
            })
            .then(pagesData => {
              if (pagesData.error) {
                console.log('Pages access failed:', pagesData.error);
              } else {
                console.log(`Found ${pagesData.data?.length || 0} pages`);
                if (pagesData.data && pagesData.data.length > 0) {
                  console.log('Pages:', pagesData.data.map(p => p.name));
                }
              }
            })
            .catch(err => console.log('Pages test error:', err));
        }
      })
      .catch(err => console.log('Token test error:', err));
  } else {
    console.log('No Facebook token found in localStorage');
    console.log('Available localStorage keys:', Object.keys(localStorage));
  }
} else {
  console.log('Not running in browser environment');
}