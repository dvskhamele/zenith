'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, loginWithFacebook } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login page: Submitting login form', { email });
    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(email, password);
      console.log('Login page: Login successful', result);
      // Redirect to dashboard on successful login
      console.log('Login page: Redirecting to dashboard');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login page: Login error', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    console.log('Login page: Initiating Facebook login');
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error('Login page: Facebook login error', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate Facebook login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 mb-6">Sign in to your account</p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500/20 text-red-300 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleFacebookLogin}
          className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Log in with Facebook
        </button>
        
        <p className="text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <a 
            href="/register" 
            className="text-sky-400 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}