'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestLocalSupabase() {
  const [status, setStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Check if we're using the local Supabase instance
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        if (supabaseUrl && supabaseUrl.includes('127.0.0.1')) {
          setStatus('Successfully connected to local Supabase instance');
        } else if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
          setStatus('ERROR: Connected to cloud Supabase instance');
          setError('This is a protocol violation! Should be using local instance only.');
        } else {
          setStatus('Supabase URL not properly configured');
          setError('No Supabase URL found in environment variables');
        }
      } catch (err) {
        setStatus('Error testing Supabase connection');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Local Supabase Connection Test</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="mb-2">Status: {status}</p>
        {error && (
          <p className="text-red-400">Error: {error}</p>
        )}
        <p className="mt-4 text-sm text-gray-400">
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
      </div>
    </div>
  );
}