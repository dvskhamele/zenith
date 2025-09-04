'use client';

import React from 'react';

export default function BestTimeToPostPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-gray-900">BrandName</a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 text-center">
        <section id="hero-best-time" className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Post at the Perfect Moment: Best Time to Post Suggestions
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Leverage data-driven insights to schedule your content when your audience is most active and engaged.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Maximize Your Reach and Engagement.</h2>
            <p className="text-gray-700 mb-4">
              Our intelligent system analyzes your historical performance data to provide personalized recommendations for the optimal times to post on each social media platform. Stop guessing, start growing.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Data-Driven Insights:</strong> Recommendations based on your unique audience engagement patterns.</li>
              <li><strong>Platform-Specific:</strong> Get optimal times for each social network you use.</li>
              <li><strong>Boost Performance:</strong> Schedule content when it's most likely to be seen and interacted with.</li>
            </ul>
            <a href="/login" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg mt-6 hover:bg-indigo-700 transition-colors text-lg flex items-center justify-center">
              Discover Your Best Times to Post &rarr;
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">Available with Marketer and Agency plans.</p>
        </section>

        <section id="benefits" className="pt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Post at Optimal Times?</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Increase visibility, drive more traffic, and get better results from your social media efforts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Higher Visibility</h3>
              <p className="text-gray-700">Ensure your content appears when your followers are online and active.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Increased Engagement</h3>
              <p className="text-gray-700">More interactions mean better algorithm performance and wider reach.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Better ROI</h3>
              <p className="text-gray-700">Maximize the return on your content creation efforts by reaching the right people at the right time.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; 2024 BrandName. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}