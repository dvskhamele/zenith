'use client';

import Link from 'next/link';

export default function FacebookDashboard() {
  const features = [
    {
      title: 'Page Management',
      description: 'View and manage your Facebook pages',
      href: '/facebook-pages',
      icon: '👥'
    },
    {
      title: 'Post Scheduler',
      description: 'Schedule posts to be published at specific times',
      href: '/post-scheduler',
      icon: '⏰'
    },
    {
      title: 'Content Library',
      description: 'Store and manage your content templates',
      href: '/content-library',
      icon: '📚'
    },
    {
      title: 'Analytics',
      description: 'View insights and performance metrics',
      href: '/analytics',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Facebook Automation Dashboard</h1>
        <p className="text-slate-400 mb-8">Manage all your Facebook page automation features</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              href={feature.href}
              className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700 hover:border-sky-500 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
              <div className="mt-4 text-sky-400 hover:text-sky-300">
                Get started →
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create Post
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Schedule Post
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              View Analytics
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Manage Pages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}