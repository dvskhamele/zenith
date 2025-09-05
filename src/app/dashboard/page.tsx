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

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Render dashboard content regardless of authentication status
  return <DashboardContent />;
}