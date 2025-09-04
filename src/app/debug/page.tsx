'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DebugPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Debug information
    const supabaseToken = localStorage.getItem('supabase_access_token');
    const facebookToken = localStorage.getItem('facebook_access_token');
    const facebookAuthCompleted = localStorage.getItem('facebook_auth_completed');
    
    setDebugInfo({
      user,
      loading,
      localStorageTokens: {
        supabaseToken: !!supabaseToken,
        facebookToken: !!facebookToken,
        facebookAuthCompleted: !!facebookAuthCompleted
      }
    });
    
    console.log('DebugPage: Auth state', { user, loading });
    console.log('DebugPage: LocalStorage tokens', {
      supabaseToken: !!supabaseToken,
      facebookToken: !!facebookToken,
      facebookAuthCompleted: !!facebookAuthCompleted
    });
  }, [user, loading]);

  const clearTokens = () => {
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_auth_completed');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Debug: Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 p-4">
      <div className="bg-slate-800 p-8 rounded-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="text-lg font-semibold text-white mb-2">Auth State</h2>
            <pre className="text-sm text-slate-300 overflow-auto">
              {JSON.stringify({ user, loading }, null, 2)}
            </pre>
          </div>
          
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="text-lg font-semibold text-white mb-2">LocalStorage Tokens</h2>
            <pre className="text-sm text-slate-300 overflow-auto">
              {JSON.stringify(debugInfo.localStorageTokens, null, 2)}
            </pre>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded hover:bg-sky-600"
            >
              Go to Login
            </button>
            
            <button
              onClick={clearTokens}
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}