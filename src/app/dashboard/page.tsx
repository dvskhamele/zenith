'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SimpleDashboardPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('calendar');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['calendar', 'facebook-pages', 'facebook-post', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <p className="text-gray-300 mb-4">Active tab: {activeTab}</p>
      
      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = '/dashboard?tab=calendar'}
          className={`px-4 py-2 rounded ${activeTab === 'calendar' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
        >
          Calendar
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard?tab=facebook-pages'}
          className={`px-4 py-2 rounded ${activeTab === 'facebook-pages' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
        >
          Facebook Pages
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard?tab=facebook-post'}
          className={`px-4 py-2 rounded ${activeTab === 'facebook-post' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
        >
          Facebook Post
        </button>
      </div>
      
      <div className="mt-8 p-6 bg-slate-800 rounded-lg">
        {activeTab === 'calendar' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Calendar Content</h2>
            <p className="text-gray-300">This is the calendar section.</p>
          </div>
        )}
        
        {activeTab === 'facebook-pages' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Facebook Pages</h2>
            <p className="text-gray-300">This is the Facebook pages management section.</p>
          </div>
        )}
        
        {activeTab === 'facebook-post' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Post to Facebook</h2>
            <p className="text-gray-300">This is the Facebook posting section.</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
            <p className="text-gray-300">This is the analytics section.</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-gray-300">This is the settings section.</p>
          </div>
        )}
      </div>
    </div>
  );
}