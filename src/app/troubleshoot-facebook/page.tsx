// Facebook Pages Troubleshooting Page
// This page helps users understand why Facebook pages aren't showing up

'use client';

import { useState, useEffect } from 'react';

export default function FacebookPagesTroubleshooting() {
  const [debugInfo, setDebugInfo] = useState({
    tokenExists: false,
    tokenValid: false,
    pagesExist: false,
    pagesCount: 0,
    accountType: 'unknown'
  });

  useEffect(() => {
    // Check localStorage for Facebook token
    const token = localStorage.getItem('facebook_access_token');
    setDebugInfo(prev => ({
      ...prev,
      tokenExists: !!token
    }));

    // Test token if it exists
    if (token) {
      testToken(token);
    }
  }, []);

  const testToken = async (token) => {
    try {
      // Test token validity
      const response = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name,email`);
      const data = await response.json();
      
      if (response.ok) {
        setDebugInfo(prev => ({
          ...prev,
          tokenValid: true,
          accountType: data.email ? 'business' : 'personal'
        }));
        
        // Test pages access
        testPagesAccess(token);
      } else {
        setDebugInfo(prev => ({
          ...prev,
          tokenValid: false
        }));
      }
    } catch (error) {
      console.error('Token test error:', error);
      setDebugInfo(prev => ({
        ...prev,
        tokenValid: false
      }));
    }
  };

  const testPagesAccess = async (token) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setDebugInfo(prev => ({
          ...prev,
          pagesExist: data.data && data.data.length > 0,
          pagesCount: data.data ? data.data.length : 0
        }));
      }
    } catch (error) {
      console.error('Pages test error:', error);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_auth_completed');
    setDebugInfo({
      tokenExists: false,
      tokenValid: false,
      pagesExist: false,
      pagesCount: 0,
      accountType: 'unknown'
    });
  };

  const reauthenticate = () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `https://qfpvsyhtijwxkmyrqswa.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=${redirectUrl}&scopes=pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Facebook Pages Troubleshooting</h1>
        
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Token Status</h3>
              <p className="text-sm text-slate-400">
                {debugInfo.tokenExists ? '✅ Token Found' : '❌ No Token'}
              </p>
              <p className="text-sm text-slate-400">
                {debugInfo.tokenValid ? '✅ Valid Token' : '❌ Invalid Token'}
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Pages Status</h3>
              <p className="text-sm text-slate-400">
                {debugInfo.pagesExist ? '✅ Pages Available' : '❌ No Pages'}
              </p>
              <p className="text-sm text-slate-400">
                Count: {debugInfo.pagesCount} pages
              </p>
            </div>
          </div>
          
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-white mb-2">Account Type</h3>
            <p className="text-sm text-slate-400">
              {debugInfo.accountType === 'business' ? 'Business Account' : 
               debugInfo.accountType === 'personal' ? 'Personal Account' : 
               'Unknown'}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Why Pages Might Not Appear</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">1. Personal Account Without Pages</h3>
              <p className="text-sm text-slate-400">
                Personal Facebook accounts don't automatically have pages. You need to create a Facebook Page 
                to post content. Business accounts typically come with pages.
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">2. Insufficient Permissions</h3>
              <p className="text-sm text-slate-400">
                The Facebook token might not have the required permissions to access your pages. 
                Re-authenticating can resolve this.
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">3. Token Expired</h3>
              <p className="text-sm text-slate-400">
                Facebook tokens expire after a certain period. Re-authenticating will generate a new token.
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">4. Network Issues</h3>
              <p className="text-sm text-slate-400">
                Temporary network issues might prevent the app from fetching your pages. Try refreshing the page.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Solutions</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">1. Re-authenticate with Facebook</h3>
              <p className="text-sm text-slate-400 mb-3">
                This will generate a new token with proper permissions.
              </p>
              <button
                onClick={reauthenticate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Re-authenticate Now
              </button>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">2. Clear Tokens and Start Fresh</h3>
              <p className="text-sm text-slate-400 mb-3">
                Remove existing tokens and re-authenticate.
              </p>
              <button
                onClick={clearTokens}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Clear Tokens
              </button>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">3. Create a Facebook Page</h3>
              <p className="text-sm text-slate-400 mb-3">
                If you don't have a Facebook Page, create one:
              </p>
              <a 
                href="https://www.facebook.com/pages/creation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg inline-block"
              >
                Create Facebook Page
              </a>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">4. Check Browser Console</h3>
              <p className="text-sm text-slate-400 mb-3">
                Open Developer Tools (F12) and check the Console tab for any error messages.
              </p>
              <button
                onClick={() => {
                  console.log('Debug info:', debugInfo);
                  alert('Check browser console (F12) for debug information');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Show Debug Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}