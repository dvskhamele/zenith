'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import the dashboard to avoid SSR issues
const DashboardContent = dynamic(() => import('./dashboard-content'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-white text-lg">Loading dashboard...</div>
    </div>
  )
});

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show login redirect if no user
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Redirecting to login...</div>
      </div>
    );
  }

  // Render dashboard for authenticated users
  return <DashboardContent />;
}