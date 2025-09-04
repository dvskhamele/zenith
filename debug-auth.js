// Simple debug script to check auth state
const debugAuth = async () => {
  console.log('Debug: Checking auth state');
  
  // Check localStorage for tokens
  const supabaseToken = localStorage.getItem('supabase_access_token');
  const facebookToken = localStorage.getItem('facebook_access_token');
  const facebookAuthCompleted = localStorage.getItem('facebook_auth_completed');
  
  console.log('Debug: Tokens in localStorage', {
    supabaseToken: !!supabaseToken,
    facebookToken: !!facebookToken,
    facebookAuthCompleted: !!facebookAuthCompleted
  });
  
  // Try to get current user
  try {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await response.json();
    console.log('Debug: User data', userData);
  } catch (error) {
    console.error('Debug: Error getting user data', error);
  }
};

debugAuth();