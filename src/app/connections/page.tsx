'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginWithFacebook } from '@/lib/auth';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [facebookToken, setFacebookToken] = useState<string | null>(null);
  const [facebookPages, setFacebookPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacebookToken = async () => {
      try {
        const response = await fetch('/api/facebook/token');
        const data = await response.json();
        
        if (response.ok) {
          setFacebookToken(data.access_token);
          // Fetch Facebook pages using the token
          await fetchFacebookPages(data.access_token);
        } else {
          setError(data.error || 'Failed to fetch Facebook token');
        }
      } catch (err) {
        setError('Failed to fetch Facebook token');
        console.error('Error fetching Facebook token:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFacebookToken();
    }
  }, [user]);

  const fetchFacebookPages = async (token: string) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setFacebookPages(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch Facebook pages');
      }
    } catch (err) {
      setError('Failed to fetch Facebook pages');
      console.error('Error fetching Facebook pages:', err);
    }
  };

  const testFacebookToken = async () => {
    if (!facebookToken) return;
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me?access_token=${facebookToken}`
      );
      const data = await response.json();
      
      if (response.ok) {
        alert(`Token valid! User: ${data.name}`);
      } else {
        alert(`Token invalid: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Failed to test token');
      console.error('Error testing token:', err);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Connections</h1>
        <p>Please log in to manage your connections.</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Social Media Connections</h1>
      
      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Facebook</h2>
          {facebookToken && (
            <button 
              onClick={testFacebookToken}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Test Connection
            </button>
          )}
        </div>
        
        {loading ? (
          <p>Loading Facebook connection...</p>
        ) : facebookToken ? (
          <div>
            <p className="text-green-400 mb-4">✓ Connected to Facebook</p>
            
            {/* Facebook Post Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Post to Facebook</h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <textarea
                  id="facebook-post-content"
                  placeholder="What's on your mind?"
                  className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  rows={3}
                />
                <button
                  onClick={async () => {
                    const content = (document.getElementById('facebook-post-content') as HTMLTextAreaElement).value;
                    if (!content.trim()) {
                      alert('Please enter some content to post');
                      return;
                    }
                    
                    try {
                      // First, let's verify we have a Facebook token
                      const tokenResponse = await fetch('/api/facebook/token');
                      const tokenData = await tokenResponse.json();
                      
                      if (!tokenResponse.ok) {
                        alert(`Token error: ${tokenData.error || 'Failed to get Facebook token'}`);
                        return;
                      }
                      
                      // Now try to post directly to Facebook API
                      const response = await fetch('https://graph.facebook.com/v19.0/me/feed', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          message: content,
                          access_token: tokenData.access_token,
                        }),
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok) {
                        alert('Posted to Facebook successfully!');
                        (document.getElementById('facebook-post-content') as HTMLTextAreaElement).value = '';
                      } else {
                        alert(`Error: ${data.error.message || data.error || 'Failed to post'}`);
                      }
                    } catch (error) {
                      alert(`Error: ${error.message}`);
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Post to Facebook
                </button>
              </div>
            </div>
            
            {facebookPages.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Your Facebook Pages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facebookPages.map((page: any) => (
                    <div key={page.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        {page.picture?.data?.url ? (
                          <img 
                            src={page.picture.data.url} 
                            alt={page.name} 
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                            <span className="text-sm font-bold">{page.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{page.name}</h4>
                          <p className="text-sm text-slate-400">{page.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No Facebook pages found.</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-yellow-400 mb-4">⚠ Facebook not connected</p>
            <button 
              onClick={async () => {
                try {
                  await loginWithFacebook();
                } catch (err) {
                  console.error('Failed to initiate Facebook login:', err);
                  setError('Failed to initiate Facebook login');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect with Facebook
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Other Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Twitter</h3>
            <p className="text-sm text-slate-400">Not connected</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">LinkedIn</h3>
            <p className="text-sm text-slate-400">Not connected</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Instagram</h3>
            <p className="text-sm text-slate-400">Not connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}