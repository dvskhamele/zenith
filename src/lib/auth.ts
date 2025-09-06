import { supabase } from '@/lib/supabaseClient';

export async function registerUser(email: string, password: string) {
  console.log('Registering user with email:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Registration error:', error);
    throw new Error(error.message);
  }

  console.log('Registration successful:', data);
  return data;
}

export async function loginUser(email: string, password: string) {
  console.log('Logging in user with email:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }

  console.log('Login successful:', data);
  return data;
}

export async function loginWithFacebook() {
  // Use the current origin for the redirect URL
  const redirectUrl = `${window.location.origin}/auth/callback`;

  console.log('Initiating Facebook OAuth with redirect URL:', redirectUrl);

  // Request proper permissions for pages access
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        scope: 'public_profile,email,pages_show_list,pages_manage_posts'
      }
    },
  });

  if (error) {
    console.error('Facebook OAuth error:', error);
    // Let's also log the specific error details
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    
    // Try again with basic scopes
    if (error.message.includes('external provider')) {
      console.log('Trying with basic scopes...');
      const { data: retryData, error: retryError } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            scope: 'public_profile,email,pages_show_list,pages_manage_posts'
          }
        },
      });
      
      if (retryError) {
        console.error('Retry failed:', retryError);
        throw new Error(retryError.message);
      }
      
      console.log('Retry successful:', retryData);
      return retryData;
    }
    
    throw new Error(error.message);
  }

  console.log('Facebook OAuth initiated successfully:', data);
  return data;
}

export async function logoutUser() {
  console.log('Logging out user');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    throw new Error(error.message);
  }
  
  console.log('Logout successful');
  return true;
}

export async function getCurrentUser() {
  console.log('Getting current user');
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error);
    throw new Error(error.message);
  }
  
  console.log('Current user:', data.user);
  return data.user;
}