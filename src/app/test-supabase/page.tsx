'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SupabaseTestPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Supabase Test: Checking session');
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase Test: Session data', data);
        console.log('Supabase Test: Session error', error);
        
        if (error) {
          console.error('Supabase Test: Error getting session', error);
        }
        
        setSession(data.session);
      } catch (err) {
        console.error('Supabase Test: Exception', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Supabase Session Test</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Session: {session ? 'Active' : 'None'}</p>
          {session && (
            <div>
              <p>User ID: {session.user?.id}</p>
              <p>User Email: {session.user?.email}</p>
              <p>Expires at: {new Date(session.expires_at * 1000).toString()}</p>
            </div>
          )}
        </div>
      )}
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );
}