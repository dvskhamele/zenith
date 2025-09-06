'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { facebookService } from '@/services/facebookService';
import FacebookPagesDebug from '@/components/FacebookPagesDebug';

export default function FacebookPagesManagement() {
  const [facebookToken, setFacebookToken] = useState<string | null>(null);
  const [facebookPages, setFacebookPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFacebookData = async () => {
      try {
        console.log('Fetching Facebook data...');
        setLoading(true);
        setError(null);
        setAuthError(null);
        
        // Check if we have a Facebook token at all
        const storedToken = localStorage.getItem('facebook_access_token');
        if (!storedToken) {
          console.log('No Facebook token found in localStorage');
          setConnectionStatus('disconnected');
          setAuthError('No Facebook access token found. Please connect your Facebook account.');
          setLoading(false);
          return;
        }
        
        console.log('Facebook token found in localStorage, length:', storedToken.length);
        
        // Test Facebook connection first
        setConnectionStatus('testing');
        const connectionResult = await facebookService.testConnection();
        
        if (!connectionResult.connected) {
          console.log('Not connected to Facebook');
          setConnectionStatus('disconnected');
          if (connectionResult.tokenInfo && !connectionResult.tokenInfo.valid) {
            setAuthError(`Facebook token is invalid: ${connectionResult.tokenInfo.error || 'Unknown error'}. Please reconnect your Facebook account.`);
          } else {
            setAuthError('Unable to connect to Facebook. Please try reconnecting your account.');
          }
          setLoading(false);
          return;
        }
        
        setConnectionStatus('connected');
        console.log('Connected to Facebook, fetching token...');
        
        // Get Facebook token
        const token = await facebookService.getAccessToken();
        if (token) {
          setFacebookToken(token);
          console.log('Token retrieved, fetching pages...');
          
          // Fetch Facebook pages
          const pages = await facebookService.getPages();
          setFacebookPages(pages);
          console.log('Pages fetched:', pages.length);
          
          // If we have no pages, show a specific message
          if (pages.length === 0) {
            console.log('No pages found for this Facebook account');
            setAuthError('No Facebook pages found. This could mean:\n' +
              '1. Your Facebook account is a personal account without business pages\n' +
              '2. Your token lacks pages_show_list permission\n' +
              '3. You don\'t have any Facebook pages\n\n' +
              'Try reconnecting your Facebook account to ensure proper permissions.');
          }
        } else {
          console.log('No token found');
          setAuthError('No Facebook access token found. Please reconnect your Facebook account.');
        }
      } catch (err) {
        console.error('Error fetching Facebook data:', err);
        setAuthError(err.message || 'Failed to fetch Facebook data. Please try reconnecting your account.');
        setConnectionStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    fetchFacebookData();
  }, []);

  const handleConnectFacebook = async () => {
    try {
      // Use the current origin for the redirect URL
      const redirectUrl = `${window.location.origin}/auth/callback`;

      // Redirect to Supabase OAuth
      window.location.href = `https://qfpvsyhtijwxkmyrqswa.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=${redirectUrl}&scopes=pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content`;
    } catch (err) {
      console.error('Facebook OAuth error:', err);
      setError('Failed to initiate Facebook login');
    }
  };

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, do a basic test
      const result = await facebookService.testConnection();
      
      if (result.connected) {
        setConnectionStatus('connected');
        setFacebookToken(await facebookService.getAccessToken());
        setFacebookPages(result.pages || []);
        alert('Successfully connected to Facebook!');
      } else {
        setConnectionStatus('disconnected');
        setError('not_connected');
      }
    } catch (err) {
      console.error('Error testing connection:', err);
      setError(err.message || 'Failed to test connection');
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const handleDebugConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('facebook_access_token');
      
      if (!token) {
        alert('No Facebook token found in localStorage. Please connect to Facebook first.');
        setLoading(false);
        return;
      }
      
      // Call the debug API endpoint
      const response = await fetch('/api/facebook/debug', {
        method: 'GET',
        headers: {
          'x-facebook-token': token
        }
      });
      
      const debugData = await response.json();
      
      if (response.ok) {
        // Display debug information in a more user-friendly way
        let debugMessage = 'Facebook Debug Information:\n\n';
        debugMessage += `Session exists: ${debugData.sessionExists ? 'Yes' : 'No'}\n`;
        debugMessage += `Token from session: ${debugData.facebookTokenFromSession ? 'Yes' : 'No'}\n`;
        debugMessage += `Token from header: ${debugData.facebookTokenFromHeader ? 'Yes' : 'No'}\n`;
        
        if (debugData.tokenValidation) {
          debugMessage += `Token valid: ${debugData.tokenValidation.isValid ? 'Yes' : 'No'}\n`;
        }
        
        debugMessage += `User profile accessible: ${debugData.userProfileAccessible ? 'Yes' : 'No'}\n`;
        
        if (debugData.userProfile) {
          debugMessage += `User: ${debugData.userProfile.name} (ID: ${debugData.userProfile.id})\n`;
        }
        
        debugMessage += `Pages accessible: ${debugData.pagesAccessible ? 'Yes' : 'No'}\n`;
        debugMessage += `Pages count: ${debugData.pagesCount || 0}\n`;
        
        if (debugData.pagesCount === 0 && debugData.pagesEmptyReasons) {
          debugMessage += '\nPossible reasons for no pages:\n';
          debugData.pagesEmptyReasons.forEach((reason: string, index: number) => {
            debugMessage += `${index + 1}. ${reason}\n`;
          });
        }
        
        if (debugData.tokenTestError) {
          debugMessage += `\nToken test error: ${debugData.tokenTestError}\n`;
        }
        
        alert(debugMessage);
      } else {
        alert(`Debug API error: ${debugData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error debugging connection:', err);
      alert(`Error debugging connection: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages</h2>
        <p className="text-slate-400">Loading Facebook pages...</p>
      </div>
    );
  }

  if (error === 'not_connected' || connectionStatus === 'disconnected') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages</h2>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl">
          <div className="text-center py-8">
            <div className="text-yellow-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect to Facebook</h3>
            <p className="text-slate-400 mb-6">
              Connect your Facebook account to manage your pages and post content.
            </p>
            <button
              onClick={handleConnectFacebook}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect with Facebook
            </button>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  const token = localStorage.getItem('facebook_access_token');
                  const completed = localStorage.getItem('facebook_auth_completed');
                  console.log('LocalStorage check:', { token, completed });
                  alert(`Token: ${token ? 'Found' : 'Not found'}, Completed: ${completed}`);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Debug: Check LocalStorage
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem('facebook_access_token');
                  if (token) {
                    try {
                      const response = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
                      const data = await response.json();
                      alert(`Token test result: ${response.ok ? 'Valid' : 'Invalid'} - ${data.name || data.error?.message || 'Unknown'}`);
                    } catch (err) {
                      alert(`Token test failed: ${err.message}`);
                    }
                  } else {
                    alert('No token found in localStorage');
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Test Token
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((error || authError) && error !== 'not_connected') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages</h2>
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6 whitespace-pre-line">
          {authError || error}
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl">
          <div className="text-center py-4">
            <button
              onClick={handleTestConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg mr-2"
            >
              Try Again
            </button>
            <button
              onClick={handleConnectFacebook}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Reconnect Facebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages</h2>
      <p className="text-slate-400 mb-6 max-w-2xl">
        Manage your connected Facebook pages. Select which pages you want to post to.
      </p>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleTestConnection}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-3 py-1 rounded-lg text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1 rounded-lg text-sm"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        <button
          onClick={handleConnectFacebook}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg text-sm"
        >
          Add Pages
        </button>
      </div>
      
      {showDebug && (
        <div className="mb-6">
          <FacebookPagesDebug />
        </div>
      )}
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Connected Pages</h3>
          <div className="flex gap-2">
            <button
              onClick={handleTestConnection}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-3 py-1 rounded-lg text-sm"
            >
              Refresh
            </button>
            <button
              onClick={handleConnectFacebook}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg text-sm"
            >
              Add Pages
            </button>
          </div>
        </div>
        
        {facebookPages.length > 0 ? (
          <div className="space-y-3">
            {facebookPages.map((page: any) => (
              <div key={page.id} className="bg-slate-900/80 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {page.picture?.data?.url ? (
                    <img 
                      src={page.picture.data.url} 
                      alt={page.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-white">{page.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{page.name}</p>
                    <p className="text-sm text-slate-400">{page.category}</p>
                  </div>
                </div>
                
                <span className="text-xs font-medium text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                  Connected
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-slate-400 mb-4">No Facebook pages found.</p>
            <div className="text-slate-400 text-sm mb-4">
              <p className="mb-2">This could mean:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You don't have any Facebook pages connected to your account</li>
                <li>Your Facebook account is a personal account without pages</li>
                <li>Your Facebook token doesn't have permission to access pages</li>
                <li>There was an issue fetching your pages from Facebook</li>
              </ul>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg mb-4">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> Facebook requires business pages for API access. Personal profiles cannot be used for posting via the API.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTestConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Try Again
              </button>
              <button
                onClick={handleDebugConnection}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Debug Connection
              </button>
              <button
                onClick={async () => {
                  // Test the current token first
                  const token = localStorage.getItem('facebook_access_token');
                  if (token) {
                    try {
                      const response = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
                      const data = await response.json();
                      if (response.ok) {
                        alert(`Token is valid for user: ${data.name}`);
                      } else {
                        alert(`Token invalid: ${data.error?.message || 'Unknown error'}`);
                      }
                    } catch (err) {
                      alert(`Token test failed: ${err.message}`);
                    }
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Test Token
              </button>
              <button
                onClick={handleConnectFacebook}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Reconnect Facebook
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => {
              // Save selected pages to localStorage
              const selectedPages = facebookPages.filter(page => page.selected);
              localStorage.setItem('facebook_selected_pages', JSON.stringify(selectedPages));
              alert('Page selection saved successfully!');
            }}
            className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}