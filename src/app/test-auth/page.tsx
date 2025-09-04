'use client';

import { useAuth } from '@/context/AuthContext';

export default function TestAuthPage() {
  const { user, loading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Auth Test</h1>
        
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : user ? (
          <div>
            <p className="text-green-400 mb-4">✓ User is authenticated</p>
            <p className="text-white">User ID: {user.id}</p>
            <p className="text-white">User Email: {user.email}</p>
          </div>
        ) : (
          <div>
            <p className="text-yellow-400 mb-4">⚠ User is not authenticated</p>
            <a 
              href="/login" 
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 inline-block"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}