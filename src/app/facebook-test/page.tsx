'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginWithFacebook } from '@/lib/auth';

export default function FacebookTestPage() {
  const { user } = useAuth();
  const [facebookToken, setFacebookToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFacebookToken = async () => {
      try {
        const response = await fetch('/api/facebook/token');
        const data = await response.json();
        
        if (response.ok) {
          setFacebookToken(data.access_token);
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

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error('Failed to initiate Facebook login:', err);
      setError('Failed to initiate Facebook login');
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
        
        {!user ? (
          <div>
            <p className="text-white mb-4">Please log in to test Facebook integration.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600"
            >
              Go to Login
            </button>
          </div>
        ) : facebookToken ? (
          <div>
            <p className="text-green-400 mb-4">✓ Connected to Facebook</p>
            <p className="text-white mb-4">Token: {facebookToken.substring(0, 50)}...</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600"
            >
              Go to Dashboard
            </button>
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