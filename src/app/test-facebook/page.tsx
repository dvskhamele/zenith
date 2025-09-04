'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginWithFacebook } from '@/lib/auth';

export default function TestFacebookPage() {
  const { user } = useAuth();
  const [facebookToken, setFacebookToken] = useState<string | null>(null);
  const [facebookPages, setFacebookPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [postStatus, setPostStatus] = useState<string | null>(null);

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
    } else {
      setLoading(false);
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

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error('Failed to initiate Facebook login:', err);
      setError('Failed to initiate Facebook login');
    }
  };

  const publishToFacebook = async () => {
    if (!postContent.trim()) {
      setError('Please enter some content to publish');
      return;
    }
    
    setPostStatus('Publishing...');
    setError(null);
    
    try {
      const response = await fetch('/api/facebook/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postContent,
          pageId: selectedPage
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPostStatus('Post published successfully!');
        setPostContent('');
      } else {
        setError(data.error || 'Failed to publish to Facebook');
        setPostStatus(null);
      }
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      setError('Failed to publish to Facebook. Please try again.');
      setPostStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Facebook Integration Test</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
            {error}
          </div>
        )}
        
        {postStatus && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded">
            {postStatus}
          </div>
        )}
        
        {!user ? (
          <div>
            <p className="text-white mb-4">Please log in to test Facebook integration.</p>
            <a
              href="/login"
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 inline-block"
            >
              Go to Login
            </a>
          </div>
        ) : facebookToken ? (
          <div>
            <p className="text-green-400 mb-4">✓ Connected to Facebook</p>
            
            {facebookPages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Your Facebook Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {facebookPages.map((page: any) => (
                    <div key={page.id} className="bg-slate-700 p-3 rounded">
                      <div className="flex items-center">
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
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Publish to Facebook</h2>
              <div className="space-y-3">
                {facebookPages.length > 0 && (
                  <div>
                    <label className="block text-slate-300 mb-2">Post to Page</label>
                    <select
                      value={selectedPage || ''}
                      onChange={(e) => setSelectedPage(e.target.value || null)}
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Post to your profile</option>
                      {facebookPages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={4}
                />
                <button
                  onClick={publishToFacebook}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Publish to Facebook
                </button>
              </div>
            </div>
            
            <a
              href="/dashboard"
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 inline-block"
            >
              Go to Dashboard
            </a>
          </div>
        ) : (
          <div>
            <p className="text-yellow-400 mb-4">⚠ Facebook not connected</p>
            <button
              onClick={handleFacebookLogin}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect with Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
}