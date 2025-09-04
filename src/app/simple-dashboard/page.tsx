'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SimpleDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Simple Dashboard: Checking user');
        const { data, error } = await supabase.auth.getUser();
        console.log('Simple Dashboard: User check result', data, error);
        
        if (error) {
          console.error('Simple Dashboard: Error getting user', error);
          router.push('/simple-login');
          return;
        }
        
        if (data?.user) {
          setUser(data.user);
        } else {
          router.push('/simple-login');
        }
      } catch (err) {
        console.error('Simple Dashboard: Exception', err);
        router.push('/simple-login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Not authenticated</h1>
        <button onClick={() => router.push('/simple-login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Simple Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Dashboard Pages</h2>
        <ul>
          <li>1. Master Schedule - Define your weekly posting cadence</li>
          <li>2. Reports (Audience & Strategy) - Analyze performance and strategy</li>
          <li>3. Connections - Manage social media accounts and integrations</li>
          <li>4. Settings - Configure workspace, team, and billing</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => router.push('/simple-login')}>Go to Login</button>
      </div>
    </div>
  );
}