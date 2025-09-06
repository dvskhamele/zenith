'use client';

import { useState, useEffect } from 'react';
import { facebookService } from '@/services/facebookService';

export default function EnhancedFacebookPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  useEffect(() => {
    loadFacebookPages();
  }, []);

  const loadFacebookPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading Facebook pages...');
      const pagesData = await facebookService.getPages();
      
      console.log(`Loaded ${pagesData.length} Facebook pages`);
      setPages(pagesData);
      
      // Auto-select first page if available
      if (pagesData.length > 0) {
        setSelectedPage(pagesData[0].id);
      }
    } catch (err) {
      console.error('Error loading Facebook pages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-slate-800 rounded-lg">
        <p className="text-slate-400">Loading your Facebook pages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 text-red-300 rounded-lg">
        Error loading Facebook pages: {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Your Facebook Pages ({pages.length})</h3>
        <button
          onClick={loadFacebookPages}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold px-2 py-1 rounded-lg"
        >
          Refresh
        </button>
      </div>
      
      {pages.length === 0 ? (
        <div className="text-slate-400 text-center py-4">
          <p>No Facebook pages found.</p>
          <p className="text-sm mt-1">This shouldn't happen if you have 7+ pages!</p>
          <button
            onClick={loadFacebookPages}
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {pages.map((page) => (
            <div 
              key={page.id}
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                selectedPage === page.id 
                  ? 'bg-slate-700 border border-slate-600' 
                  : 'bg-slate-900/50 hover:bg-slate-700'
              }`}
              onClick={() => setSelectedPage(page.id)}
            >
              {page.picture?.data?.url ? (
                <img 
                  src={page.picture.data.url} 
                  alt={page.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {page.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-white">{page.name}</p>
                <p className="text-xs text-slate-400">{page.category}</p>
                {page.fan_count && (
                  <p className="text-xs text-slate-500">{page.fan_count} fans</p>
                )}
              </div>
              {selectedPage === page.id && (
                <div className="text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => {
            // Clear tokens and reconnect
            localStorage.removeItem('facebook_access_token');
            localStorage.removeItem('facebook_auth_completed');
            window.location.href = `${window.location.origin}/auth/callback`;
          }}
          className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg"
        >
          Reconnect
        </button>
        <button
          onClick={loadFacebookPages}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold px-3 py-1 rounded-lg"
        >
          Refresh All
        </button>
      </div>
    </div>
  );
}