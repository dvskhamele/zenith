// Facebook Pages Debug Component
// This component helps diagnose Facebook pages loading issues

'use client';

import { useState, useEffect } from 'react';

export default function FacebookPagesDebug() {
  const [debugInfo, setDebugInfo] = useState({
    token: null,
    tokenValid: null,
    userProfile: null,
    pages: null,
    error: null,
    loading: false
  });

  const testFacebookToken = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('facebook_access_token');
      setDebugInfo(prev => ({ ...prev, token }));
      
      if (!token) {
        setDebugInfo(prev => ({ ...prev, error: 'No Facebook token found', loading: false }));
        return;
      }
      
      // Test token validity
      console.log('Testing token validity...');
      const userResponse = await fetch(
        `https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name,email`
      );
      
      const userData = await userResponse.json();
      console.log('User data response:', userData);
      
      if (!userResponse.ok) {
        setDebugInfo(prev => ({ ...prev, tokenValid: false, error: userData.error?.message || 'Invalid token', loading: false }));
        return;
      }
      
      setDebugInfo(prev => ({ ...prev, tokenValid: true, userProfile: userData }));
      
      // Test pages fetch
      console.log('Fetching Facebook pages...');
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${token}&fields=name,id,category,picture,fan_count`
      );
      
      const pagesData = await pagesResponse.json();
      console.log('Pages data response:', pagesData);
      
      if (!pagesResponse.ok) {
        setDebugInfo(prev => ({ ...prev, error: pagesData.error?.message || 'Failed to fetch pages', loading: false }));
        return;
      }
      
      setDebugInfo(prev => ({ ...prev, pages: pagesData.data || [], loading: false }));
      
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  const clearFacebookTokens = () => {
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_auth_completed');
    setDebugInfo({
      token: null,
      tokenValid: null,
      userProfile: null,
      pages: null,
      error: null,
      loading: false
    });
  };

  const reauthenticateWithFacebook = () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `https://qfpvsyhtijwxkmyrqswa.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=${redirectUrl}&scopes=pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content`;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages Debug</h2>
      
      <div className="space-y-6">
        {/* Debug Controls */}
        <div className="flex gap-3">
          <button
            onClick={testFacebookToken}
            disabled={debugInfo.loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {debugInfo.loading ? 'Testing...' : 'Test Facebook Connection'}
          </button>
          
          <button
            onClick={clearFacebookTokens}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Clear Tokens
          </button>
          
          <button
            onClick={reauthenticateWithFacebook}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Re-authenticate
          </button>
        </div>
        
        {/* Token Status */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Token Status</h3>
          <div className="text-sm">
            <p className="text-slate-400">Token Present: {debugInfo.token ? 'Yes' : 'No'}</p>
            <p className="text-slate-400">Token Valid: {debugInfo.tokenValid === null ? 'Unknown' : debugInfo.tokenValid ? 'Yes' : 'No'}</p>
            {debugInfo.token && (
              <p className="text-slate-400">Token Preview: {debugInfo.token.substring(0, 30)}...</p>
            )}
          </div>
        </div>
        
        {/* User Profile */}
        {debugInfo.userProfile && (
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">User Profile</h3>
            <div className="text-sm">
              <p className="text-slate-400">Name: {debugInfo.userProfile.name}</p>
              <p className="text-slate-400">ID: {debugInfo.userProfile.id}</p>
              {debugInfo.userProfile.email && (
                <p className="text-slate-400">Email: {debugInfo.userProfile.email}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Pages Status */}
        {debugInfo.pages !== null && (
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Pages Status</h3>
            <div className="text-sm">
              <p className="text-slate-400">Pages Found: {debugInfo.pages.length}</p>
              {debugInfo.pages.length > 0 ? (
                <div className="mt-2">
                  <p className="text-slate-400 mb-1">Pages List:</p>
                  <ul className="list-disc list-inside text-slate-400">
                    {debugInfo.pages.map((page, index) => (
                      <li key={index}>{page.name} ({page.category})</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-yellow-400">⚠ No Facebook pages found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    This could mean you don't have any Facebook pages connected to your account.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {debugInfo.error && (
          <div className="bg-red-500/20 p-4 rounded-lg">
            <h3 className="font-semibold text-red-300 mb-2">Error</h3>
            <p className="text-red-300 text-sm">{debugInfo.error}</p>
          </div>
        )}
        
        {/* Troubleshooting Guide */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Troubleshooting Guide</h3>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• If no pages found: Create a Facebook Page or use business account</p>
            <p>• If token invalid: Re-authenticate with Facebook</p>
            <p>• If permissions denied: Grant all requested scopes</p>
            <p>• If persistent issues: Check Facebook Developer Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}