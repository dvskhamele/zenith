'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthDebugger() {
  const [urlInfo, setUrlInfo] = useState({});
  const [localStorageItems, setLocalStorageItems] = useState({});
  const [sessionInfo, setSessionInfo] = useState(null);
  const [facebookToken, setFacebookToken] = useState(null);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    // Capture URL information
    setUrlInfo({
      href: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      urlParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      hashParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)))
    });

    // Capture localStorage items
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('facebook') || key.includes('token') || key.includes('auth')) {
        localStorageData[key] = localStorage.getItem(key);
      }
    }
    setLocalStorageItems(localStorageData);

    // Check for Facebook tokens in URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const tokenFromParams = urlParams.get('access_token') || hashParams.get('access_token');
    if (tokenFromParams) {
      setFacebookToken(tokenFromParams);
      localStorage.setItem('facebook_access_token_debug', tokenFromParams);
    } else {
      // Check localStorage
      const storedToken = localStorage.getItem('facebook_access_token') || 
                         localStorage.getItem('facebook_access_token_debug');
      if (storedToken) {
        setFacebookToken(storedToken);
      }
    }
  }, []);

  const testFacebookToken = async () => {
    if (!facebookToken) {
      setTestResults('No Facebook token found');
      return;
    }

    try {
      // Test the token by calling Facebook's debug API
      const response = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${facebookToken}&access_token=${facebookToken}`
      );
      
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults(`Error testing token: ${error.message}`);
    }
  };

  const testPagesApi = async () => {
    if (!facebookToken) {
      setTestResults('No Facebook token found');
      return;
    }

    try {
      // Test the token by calling Facebook's pages API
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${facebookToken}`
      );
      
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults(`Error testing pages API: ${error.message}`);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_access_token_debug');
    localStorage.removeItem('facebook_auth_completed');
    setFacebookToken(null);
    setLocalStorageItems({});
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">OAuth Debugger</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">URL Information</h2>
          <div className="bg-slate-700 p-4 rounded">
            <pre className="text-slate-300 text-sm overflow-auto">
              {JSON.stringify(urlInfo, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">LocalStorage Items</h2>
          <div className="bg-slate-700 p-4 rounded">
            <pre className="text-slate-300 text-sm overflow-auto">
              {JSON.stringify(localStorageItems, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Facebook Access Token</h2>
          {facebookToken ? (
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-300 break-all">{facebookToken}</p>
              <p className="text-sm text-slate-400 mt-2">Token length: {facebookToken.length} characters</p>
            </div>
          ) : (
            <p className="text-slate-400">No Facebook access token found</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={testFacebookToken}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Token Validity
          </button>
          
          <button
            onClick={testPagesApi}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Pages API
          </button>
          
          <button
            onClick={clearTokens}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Tokens
          </button>
        </div>
        
        {testResults && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Test Results</h2>
            <div className="bg-slate-700 p-4 rounded">
              <pre className="text-slate-300 text-sm overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}