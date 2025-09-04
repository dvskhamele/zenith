'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
      
      // Close the modal on successful login
      onClose();
      
      // Show success message
      alert('Login successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-4">Welcome Back!</h3>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Don't have an account?{' '}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              // We would need to switch to registration modal here
              // For now, just close and alert
              onClose();
              alert('Please use the registration form on the main page.');
            }}
            className="text-sky-400 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}