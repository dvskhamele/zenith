'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TestDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if tab parameter exists
    const tab = searchParams.get('tab');
    console.log('Current tab:', tab);
    
    // Test navigation to dashboard with different tabs
    const testNavigation = () => {
      console.log('Testing navigation...');
    };
    
    testNavigation();
  }, [searchParams]);

  const navigateToTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Navigation Test</h1>
      <div className="space-y-4">
        <button 
          onClick={() => navigateToTab('calendar')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Go to Calendar
        </button>
        <button 
          onClick={() => navigateToTab('facebook-pages')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Go to Facebook Pages
        </button>
        <button 
          onClick={() => navigateToTab('facebook-post')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Go to Post to Facebook
        </button>
        <button 
          onClick={() => navigateToTab('analytics')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Go to Analytics
        </button>
        <button 
          onClick={() => navigateToTab('settings')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Go to Settings
        </button>
      </div>
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <p className="text-white">Current URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
        <p className="text-white">Current tab: {searchParams.get('tab') || 'none'}</p>
      </div>
    </div>
  );
}