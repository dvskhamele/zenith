'use client';

import { useState } from 'react';
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

export default function SimpleDashboard() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'analytics' | 'settings'>('calendar');

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Zenith</h1>
          <p className="text-gray-400 text-sm">Social Media Management</p>
        </div>
        
        <nav>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full text-left px-4 py-2 rounded-md mb-2 ${activeTab === 'calendar' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-2 rounded-md mb-2 ${activeTab === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === 'calendar' && 'Content Calendar'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
              Add Post
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'calendar' && <VisualCalendar />}
          {activeTab === 'analytics' && (
            <div className="p-8">
              <h3 className="text-xl text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-400">Analytics content will be displayed here.</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-8">
              <h3 className="text-xl text-white mb-4">Settings</h3>
              <p className="text-gray-400">Settings content will be displayed here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}