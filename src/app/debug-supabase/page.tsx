'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SupabaseDebugPage() {
  const [status, setStatus] = useState('Initializing...');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('Supabase Debug: Initializing');
    
    // Check if Supabase client is working
    if (!supabase) {
      setStatus('Error: Supabase client not initialized');
      return;
    }
    
    setStatus('Getting session...');
    
    // Get current session
    const getSession = async () => {
      try {
        console.log('Supabase Debug: Getting session');
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase Debug: Session result', data, error);
        
        if (error) {
          setStatus(`Error getting session: ${error.message}`);
          return;
        }
        
        setSession(data.session);
        setStatus('Session retrieved');
        
        // Get current user
        if (data.session?.user) {
          setUser(data.session.user);
          setStatus(`User authenticated: ${data.session.user.email}`);
        } else {
          setStatus('No active session');
        }
      } catch (err) {
        console.error('Supabase Debug: Exception', err);
        setStatus(`Exception: ${err.message}`);
      }
    };
    
    getSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Debug: Auth state changed', event, session);
    });
    
    // Cleanup
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleTestAuth = async () => {
    try {
      setStatus('Testing authentication...');
      const { data, error } = await supabase.auth.getUser();
      console.log('Supabase Debug: getUser result', data, error);
      
      if (error) {
        setStatus(`Auth test failed: ${error.message}`);
      } else if (data?.user) {
        setUser(data.user);
        setStatus(`Authenticated user: ${data.user.email}`);
      } else {
        setStatus('No authenticated user');
      }
    } catch (err) {
      console.error('Supabase Debug: Auth test exception', err);
      setStatus(`Auth test exception: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Supabase Debug</h1>
      <p>Status: {status}</p>
      
      {session && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h2>Session</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
      
      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h2>User</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleTestAuth}
          style={{ padding: '10px 15px', marginRight: '10px' }}
        >
          Test Auth
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 15px' }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}