'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the VisualCalendar component to avoid SSR issues
const VisualCalendar = dynamic(() => import('./visual-calendar'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading calendar...</div>
    </div>
  )
});

// Dynamically import Facebook components to avoid SSR issues

const FacebookPagesManagement = dynamic(() => import('../../components/FacebookPagesManagement'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading Facebook pages...</div>
    </div>
  )
});

const FacebookPostWidget = dynamic(() => import('../../components/FacebookPostWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading Facebook post widget...</div>
    </div>
  )
});

export default function SimpleDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get active tab from URL or default to 'calendar'
  const getActiveTab = () => {
    const tab = searchParams.get('tab');
    if (tab && ['calendar', 'facebook-pages', 'facebook-post', 'analytics', 'settings'].includes(tab)) {
      return tab;
    }
    return 'calendar';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`${pathname}?tab=${tab}`);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar with labeled icons */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Zenith</h1>
          <p className="text-gray-400 text-sm">Social Media Management</p>
        </div>
        
        <nav className="space-y-1">
          <button 
            onClick={() => handleTabChange('calendar')}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'calendar' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="font-medium">Calendar</div>
              <div className="text-xs text-gray-400">Content scheduling</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleTabChange('facebook-pages')}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'facebook-pages' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <div>
              <div className="font-medium">Facebook Pages</div>
              <div className="text-xs text-gray-400">Manage your pages</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleTabChange('facebook-post')}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'facebook-post' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <div>
              <div className="font-medium">Post to Facebook</div>
              <div className="text-xs text-gray-400">Create and publish</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleTabChange('analytics')}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-xs text-gray-400">Performance metrics</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleTabChange('settings')}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-400">Account preferences</div>
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === 'calendar' && 'Content Calendar'}
            {activeTab === 'facebook-pages' && 'Facebook Pages'}
            {activeTab === 'facebook-post' && 'Post to Facebook'}
            {activeTab === 'analytics' && 'Analytics Dashboard'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard?page=composer')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Post
            </button>
            <button 
              onClick={() => router.push('/dashboard?page=composer')}
              className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Post
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'calendar' && <VisualCalendar />}
          {activeTab === 'facebook-pages' && (
            <div className="p-6">
              <FacebookPagesManagement />
            </div>
          )}
          {activeTab === 'facebook-post' && (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <FacebookPostWidget />
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl text-white mb-4">Analytics Dashboard</h3>
                <p className="text-gray-400">Analytics content will be displayed here.</p>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl text-white mb-4">Settings</h3>
                <p className="text-gray-400">Settings content will be displayed here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}