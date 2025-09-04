import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qfpvsyhtijwxkmyrqswa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugFacebookAuth() {
  console.log('=== Facebook Auth Debug ===');
  
  // Check if we can get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    return;
  }
  
  console.log('Session:', session);
  
  if (session) {
    console.log('User:', session.user);
    console.log('Provider token:', session.provider_token);
    
    // Test the Facebook token if available
    if (session.provider_token) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v19.0/me?access_token=${session.provider_token}`
        );
        const data = await response.json();
        console.log('Facebook user info:', data);
      } catch (error) {
        console.error('Error testing Facebook token:', error);
      }
    }
  } else {
    console.log('No active session');
  }
}

debugFacebookAuth();