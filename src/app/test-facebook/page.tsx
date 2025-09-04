'use client';

import { useEffect } from 'react';

export default function TestFacebookPage() {
  useEffect(() => {
    // Check if Facebook components are available
    console.log('Testing Facebook components...');
    
    // Check if localStorage has Facebook token
    const token = localStorage.getItem('facebook_access_token');
    console.log('Facebook token in localStorage:', token ? 'Found' : 'Not found');
    
    // Check if Facebook service is available
    try {
      import('@/services/facebookService').then((module) => {
        console.log('Facebook service loaded successfully');
        console.log('facebookService:', module.facebookService);
      }).catch((error) => {
        console.error('Error loading Facebook service:', error);
      });
    } catch (error) {
      console.error('Error importing Facebook service:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Facebook Integration Test</h1>
      <p className="text-gray-400">Check the browser console for test results.</p>
    </div>
  );
}