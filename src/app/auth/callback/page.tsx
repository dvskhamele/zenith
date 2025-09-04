'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Debug: Log the full URL and hash params
    console.log('=== OAuth Callback Debug Info ===');
    console.log('Full URL:', window.location.href);
    console.log('Window location object:', window.location);
    
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    console.log('Hash Params:', Object.fromEntries(hashParams.entries()));

    // Extract the provider token (Facebook access token) from the URL hash
    const providerToken = hashParams.get('provider_token');
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (providerToken) {
      console.log('Facebook provider token found in URL hash');
      console.log('Provider token length:', providerToken.length);
      localStorage.setItem('facebook_access_token', providerToken);
      localStorage.setItem('facebook_auth_completed', 'true');
      
      // Store Supabase tokens if available
      if (accessToken) {
        localStorage.setItem('supabase_access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('supabase_refresh_token', refreshToken);
      }
      
      // Redirect to Facebook Pages management
      console.log('Redirecting to Facebook Pages management');
      router.push('/dashboard?tab=facebook-pages');
    } else {
      console.error('No provider token found in the URL hash');
      console.log('Available hash keys:', Array.from(hashParams.keys()));
      
      // If we have a Supabase access token, try to store it
      if (accessToken) {
        console.log('Storing Supabase access token as fallback');
        localStorage.setItem('supabase_access_token', accessToken);
        localStorage.setItem('facebook_auth_completed', 'true');
      }
      
      // Redirect to Facebook Pages management anyway to see what we have
      router.push('/dashboard?tab=facebook-pages');
    }
  }, [router]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Processing Facebook Login...</h1>
      <p>Please wait while we complete the authentication process.</p>
    </div>
  );
}