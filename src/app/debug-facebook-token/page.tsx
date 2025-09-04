// Facebook Token Debug Page
// Helps manually store Facebook tokens for testing

'use client';

import { useState } from 'react';

export default function FacebookTokenDebug() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState('');

  const storeToken = () => {
    if (!token.trim()) {
      setResult('Please enter a Facebook token');
      return;
    }

    try {
      // Store the token in localStorage
      localStorage.setItem('facebook_access_token', token);
      localStorage.setItem('facebook_auth_completed', 'true');
      
      setResult('✅ Token stored successfully! Refresh the page to see changes.');
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setResult(`❌ Error storing token: ${error.message}`);
    }
  };

  const clearTokens = () => {
    try {
      localStorage.removeItem('facebook_access_token');
      localStorage.removeItem('facebook_auth_completed');
      setToken('');
      setResult('✅ Tokens cleared successfully!');
    } catch (error) {
      setResult(`❌ Error clearing tokens: ${error.message}`);
    }
  };

  const testToken = async () => {
    if (!token.trim()) {
      setResult('Please enter a Facebook token to test');
      return;
    }

    try {
      // Test the token with Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name,email`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Token is valid! User: ${data.name} (${data.id})`);
      } else {
        setResult(`❌ Token is invalid: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`❌ Error testing token: ${error.message}`);
    }
  };

  const checkStoredTokens = () => {
    try {
      const storedToken = localStorage.getItem('facebook_access_token');
      const authCompleted = localStorage.getItem('facebook_auth_completed');
      
      if (storedToken) {
        setResult(`✅ Token found! Length: ${storedToken.length} characters
Auth completed: ${authCompleted}`);
        setToken(storedToken);
      } else {
        setResult('❌ No token found in localStorage');
      }
    } catch (error) {
      setResult(`❌ Error checking tokens: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2">Facebook Token Debug</h1>
        <p className="text-slate-400 mb-6">Manually store and test Facebook tokens</p>
        
        {result && (
          <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-white whitespace-pre-wrap">{result}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Store Token</h2>
            
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Facebook Access Token
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your Facebook access token here..."
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={storeToken}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Store Token
              </button>
              
              <button
                onClick={testToken}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Test Token
              </button>
              
              <button
                onClick={clearTokens}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Clear Tokens
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Check Stored Tokens</h2>
            
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-4">
                Check what tokens are currently stored in localStorage
              </p>
              
              <button
                onClick={checkStoredTokens}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg text-sm mb-3"
              >
                Check Stored Tokens
              </button>
              
              <div className="text-xs text-slate-400 bg-slate-800 p-3 rounded-lg">
                <p className="mb-2">To manually check in browser console:</p>
                <code className="block bg-slate-900 p-2 rounded">
                  localStorage.getItem('facebook_access_token')
                </code>
                <code className="block bg-slate-900 p-2 rounded mt-1">
                  localStorage.getItem('facebook_auth_completed')
                </code>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-white mb-2">Instructions</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Get token from Facebook Graph API Explorer</li>
                <li>• Paste token in the text area</li>
                <li>• Click "Store Token" to save it</li>
                <li>• Refresh dashboard to see pages</li>
                <li>• Click "Test Token" to verify validity</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Get Facebook Token</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Option 1: Facebook Graph API Explorer</h3>
              <p className="text-xs text-slate-400 mb-2">
                Visit Facebook Developer Tools to generate a token:
              </p>
              <a 
                href="https://developers.facebook.com/tools/explorer/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs underline"
              >
                https://developers.facebook.com/tools/explorer/
              </a>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Option 2: Re-authenticate with Zenith</h3>
              <p className="text-xs text-slate-400 mb-2">
                Click the button below to re-authenticate:
              </p>
              <a 
                href="/auth/callback" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg text-sm inline-block"
              >
                Re-authenticate with Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}