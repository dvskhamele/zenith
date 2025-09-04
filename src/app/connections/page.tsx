'use client';

import { useState } from 'react';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState({
    socialAccounts: [
      { id: 1, name: '@innovatecorp', platform: 'twitter', connected: true },
      { id: 2, name: 'Innovate Corp', platform: 'linkedin', connected: true },
    ],
    appIntegrations: [
      { id: 1, name: 'Canva', connected: true },
      { id: 2, name: 'InVideo', connected: false },
      { id: 3, name: 'Adobe Creative Cloud', connected: false },
    ]
  });

  const toggleConnection = (type: 'socialAccounts' | 'appIntegrations', id: number) => {
    setConnections(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    }));
  };

  return (
    <div className="bg-slate-900 text-gray-200 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
        <p className="text-slate-400 mb-8">Connect your social media accounts and third-party tools to automate your workflow.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Social Accounts */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Social Accounts</h2>
              <p className="text-slate-400 text-sm mt-1">Connect your social media accounts to publish posts automatically.</p>
            </div>
            <div className="p-6 space-y-4">
              {connections.socialAccounts.map(account => (
                <div key={account.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    {account.platform === 'twitter' ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.482 2.457-2.482 1.291 0 2.543.856 2.543 3.322v7.556h4.98v-10.298c0-4.836-2.904-6.702-6.485-6.702-3.582 0-5.487 1.957-5.487 1.957v-1.657z"></path>
                      </svg>
                    )}
                    <div>
                      <p className="font-medium text-white">{account.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{account.platform}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${account.connected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {account.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors text-sm font-medium">
                + Add Social Account
              </button>
            </div>
          </div>
          
          {/* App Integrations */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">App Integrations</h2>
              <p className="text-slate-400 text-sm mt-1">Connect third-party tools to enhance your content creation workflow.</p>
            </div>
            <div className="p-6 space-y-4">
              {connections.appIntegrations.map(app => (
                <div key={app.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <span className="font-medium text-white text-sm">{app.name.charAt(0)}</span>
                    </div>
                    <p className="font-medium text-white">{app.name}</p>
                  </div>
                  {app.connected ? (
                    <button 
                      onClick={() => toggleConnection('appIntegrations', app.id)}
                      className="text-xs font-semibold bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button 
                      onClick={() => toggleConnection('appIntegrations', app.id)}
                      className="text-xs font-semibold bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors text-sm font-medium">
                + Add Integration
              </button>
            </div>
          </div>
        </div>
        
        {/* API Access Section */}
        <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">API Access</h2>
            <p className="text-slate-400 text-sm mt-1">Generate API keys to integrate with custom tools and services.</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-white">Primary API Key</p>
                <p className="text-sm text-slate-400">Use this key to authenticate API requests</p>
              </div>
              <div className="flex items-center gap-3">
                <code className="text-sm bg-slate-700 px-3 py-1.5 rounded font-mono">••••••••••••••••••••</code>
                <button className="text-xs font-semibold bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-md transition-colors">
                  Reveal
                </button>
                <button className="text-xs font-semibold bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-md transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button className="text-sky-400 hover:text-sky-300 text-sm font-medium">
                View API Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}