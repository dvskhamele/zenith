'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FacebookPages() {
  const [facebookAccessToken, setFacebookAccessToken] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('=== Facebook Pages Page Debug Info ===');
    
    // Debug: Check localStorage directly
    const storedToken = localStorage.getItem('facebook_access_token');
    const authCompleted = localStorage.getItem('facebook_auth_completed');
    
    console.log('Facebook access token from localStorage:', storedToken);
    console.log('Facebook auth completed flag:', authCompleted);
    
    if (storedToken) {
      setFacebookAccessToken(storedToken);
      setDebugInfo({
        tokenLength: storedToken.length,
        authCompleted: authCompleted === 'true'
      });
      
      // Redirect to dashboard after a short delay to show the success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      console.log('No Facebook access token found');
      // Redirect to login if no token
      router.push('/login');
    }
  }, [router]);

  const handleTestToken = async () => {
    if (!facebookAccessToken) return;
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me?access_token=${facebookAccessToken}`
      );
      const data = await response.json();
      console.log('Token test response:', data);
      alert(`Token valid! User: ${data.name || 'Unknown'}`);
    } catch (error) {
      console.error('Token test failed:', error);
      alert('Token test failed. Check console for details.');
    }
  };

  const handleClearTokens = () => {
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_auth_completed');
    setFacebookAccessToken(null);
    setDebugInfo(null);
    console.log('Tokens cleared from localStorage');
    alert('Tokens cleared!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Facebook Pages Management</h1>
      
      {facebookAccessToken ? (
        <div>
          <p style={{ color: 'green' }}>✓ Access token found! Redirecting to dashboard...</p>
          <p>Token length: {debugInfo?.tokenLength} characters</p>
          <p>Auth completed: {debugInfo?.authCompleted ? 'Yes' : 'No'}</p>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleTestToken}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#4267B2', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Test Token Validity
            </button>
            
            <button 
              onClick={handleClearTokens}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Tokens
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: 'red' }}>✗ No access token found.</p>
          <p>Please log in with Facebook first.</p>
          <button 
            onClick={() => router.push('/login')}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#4267B2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Log in with Facebook
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Debug Information</h3>
        <p>Check browser console for detailed logs.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}