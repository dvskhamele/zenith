// Test Facebook token scopes
console.log('=== FACEBOOK TOKEN SCOPE TEST ===');

// Check if running in browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const token = localStorage.getItem('facebook_access_token');
  
  if (token) {
    console.log('Testing token scopes...');
    
    // Debug token to see what scopes it has
    fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`)
      .then(response => response.json())
      .then(data => {
        console.log('Token debug info:', data);
        if (data.data && data.data.scopes) {
          console.log('Token scopes:', data.data.scopes);
          
          // Check for required scopes
          const hasPagesReadEngagement = data.data.scopes.includes('pages_read_engagement');
          const hasPagesManagePosts = data.data.scopes.includes('pages_manage_posts');
          const hasPublishToGroups = data.data.scopes.includes('publish_to_groups');
          
          console.log('Has pages_read_engagement:', hasPagesReadEngagement);
          console.log('Has pages_manage_posts:', hasPagesManagePosts);
          console.log('Has publish_to_groups:', hasPublishToGroups);
          
          if (hasPagesReadEngagement && hasPagesManagePosts) {
            console.log('✅ Token has required page permissions');
          } else if (hasPublishToGroups) {
            console.log('✅ Token has group posting permission');
          } else {
            console.log('❌ Token missing required permissions');
            console.log('You need either:');
            console.log('1. publish_to_groups permission, OR');
            console.log('2. Both pages_read_engagement AND pages_manage_posts permissions');
          }
        }
      })
      .catch(err => console.log('Error checking token scopes:', err));
  } else {
    console.log('No Facebook token found');
  }
} else {
  console.log('Not running in browser');
}