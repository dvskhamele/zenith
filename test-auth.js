// Test registration and login functionality using Supabase client directly

const { createClient } = require('@supabase/supabase-js');

// Use the local Supabase URL and keys from the running instance
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('Testing registration...');
    
    // Register a new user
    const { data: registerData, error: registerError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
    });
    
    if (registerError) {
      console.error('Registration error:', registerError);
      return;
    }
    
    console.log('Registration result:', registerData);
    
    console.log('Testing login...');
    
    // Login with the same user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });
    
    if (loginError) {
      console.error('Login error:', loginError);
      return;
    }
    
    console.log('Login result:', loginData);
    
    console.log('Testing get current user...');
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Get user error:', userError);
      return;
    }
    
    console.log('Current user:', userData);
    
    console.log('Testing logout...');
    
    // Logout
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('Logout error:', logoutError);
      return;
    }
    
    console.log('Logout successful');
    
    console.log('All authentication tests passed!');
  } catch (error) {
    console.error('Authentication test failed:', error);
  }
}

// Run the test
testAuth();