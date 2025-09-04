// Simple script to help debug Facebook token issues
console.log('=== FACEBOOK TOKEN DEBUG ===');

// Check if we're in a browser environment
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('Browser environment detected');
  
  // Check localStorage for Facebook tokens
  const facebookToken = localStorage.getItem('facebook_access_token');
  const authCompleted = localStorage.getItem('facebook_auth_completed');
  const supabaseToken = localStorage.getItem('supabase_access_token');
  
  console.log('Facebook Access Token:', facebookToken ? `Found (length: ${facebookToken.length})` : 'Not found');
  console.log('Facebook Auth Completed:', authCompleted || 'Not found');
  console.log('Supabase Access Token:', supabaseToken ? `Found (length: ${supabaseToken.length})` : 'Not found');
  
  // List all localStorage items
  console.log('\n=== ALL LOCALSTORAGE ITEMS ===');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null');
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
          
          // Test pages access
          console.log('\n=== TESTING PAGES ACCESS ===');
          fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${facebookToken}&fields=name,id,category,picture,fan_count`)
            .then(response => response.json())
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
    console.log('\nNo Facebook token found. You need to connect your Facebook account first.');
  }
} else {
  console.log('Not in browser environment - cannot access localStorage');
}