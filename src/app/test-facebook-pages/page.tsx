'use client';

import { useState, useEffect } from 'react';

export default function FacebookPagesTest() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFacebookPages = async () => {
    setLoading(true);
    setError(null);
    setPages([]);

    try {
      console.log('Testing Facebook pages API...');
      
      // Test the pages API endpoint
      const response = await fetch('/api/facebook/pages');
      const data = await response.json();
      
      console.log('Pages API response:', data);
      
      if (response.ok && data.success) {
        setPages(data.pages);
      } else {
        setError(data.error || 'Failed to fetch Facebook pages');
      }
    } catch (err) {
      console.error('Error testing Facebook pages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test on component mount
    testFacebookPages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Facebook Pages Test</h1>
        
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Facebook Pages API Test</h2>
            <button
              onClick={testFacebookPages}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Pages API'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4">
              Error: {error}
            </div>
          )}
          
          {loading ? (
            <p className="text-slate-400">Loading Facebook pages...</p>
          ) : (
            <div>
              <p className="text-slate-400 mb-4">
                Found {pages.length} Facebook pages
              </p>
              
              {pages.length > 0 ? (
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div key={page.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        {page.picture?.data?.url ? (
                          <img 
                            src={page.picture.data.url} 
                            alt={page.name} 
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {page.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{page.name}</p>
                          <p className="text-sm text-slate-400">{page.category}</p>
                          {page.fan_count && (
                            <p className="text-xs text-slate-500">
                              {page.fan_count} fans
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No Facebook pages found.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Manual Debugging</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">Test Token Manually</h3>
              <p className="text-sm text-slate-400 mb-2">
                Run this in your browser console:
              </p>
              <pre className="bg-slate-900 p-3 rounded-lg text-sm text-slate-300 overflow-x-auto">
{`const token = localStorage.getItem('facebook_access_token');
fetch(\`https://graph.facebook.com/v19.0/me/accounts?access_token=\${token}&fields=name,id,category,picture,fan_count\`)
  .then(res => res.json())
  .then(data => console.log('Pages:', data));`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Check Token Permissions</h3>
              <p className="text-sm text-slate-400 mb-2">
                Visit Facebook Access Token Debugger:
              </p>
              <a 
                href="https://developers.facebook.com/tools/debug/accesstoken/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                https://developers.facebook.com/tools/debug/accesstoken/
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}