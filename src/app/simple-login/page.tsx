'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      console.log('Simple Login: Attempting login with', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Simple Login: Result', data, error);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        setMessage('Login successful! Redirecting...');
        // Small delay to show success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('Login failed: No user returned');
      }
    } catch (err) {
      console.error('Simple Login: Exception', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      console.log('Simple Register: Attempting registration with', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('Simple Register: Result', data, error);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        setMessage('Registration successful! Please check your email to confirm your account.');
      } else {
        setError('Registration failed: No user returned');
      }
    } catch (err) {
      console.error('Simple Register: Exception', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Simple Login</h1>
      
      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '15px' }}>
          Error: {error}
        </div>
      )}
      
      {message && (
        <div style={{ backgroundColor: '#e8f5e8', color: '#2e7d32', padding: '10px', marginBottom: '15px' }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 15px', marginRight: '10px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <form onSubmit={handleRegister}>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 15px' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
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