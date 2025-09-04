'use client';

import React from 'react';

export default function QueueApprovalsPage() {
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
        <section id="hero-approvals" className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Streamline Content Approvals with Queue-Based Workflows
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Eliminate bottlenecks and get content approved faster. Manage approvals in batches, not one by one.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Efficient Approvals for Teams.</h2>
            <p className="text-gray-700 mb-4">
              Our queue-based approval system integrates directly into your content workflow, allowing managers and clients to approve content in batches, ensuring a smooth and rapid publishing pipeline.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Batch Approvals:</strong> Review and approve multiple posts within a content queue simultaneously.</li>
              <li><strong>Integrated Workflow:</strong> Approvals are part of your content lifecycle, not a separate process.</li>
              <li><strong>Clear Status:</strong> Instantly see which content is awaiting approval and who needs to act.</li>
            </ul>
            <a href="/login" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg mt-6 hover:bg-indigo-700 transition-colors text-lg flex items-center justify-center">
              Simplify Your Approvals &rarr;
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">Available with Agency plans.</p>
        </section>

        <section id="benefits" className="pt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Queue-Based Approvals?</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Accelerate your content pipeline and improve team collaboration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Speed Up Workflow</h3>
              <p className="text-gray-700">Reduce approval times and get content published faster.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce Errors</h3>
              <p className="text-gray-700">Ensure all content is reviewed and approved before going live.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Improve Collaboration</h3>
              <p className="text-gray-700">Provide a clear, centralized process for team and client feedback.</p>
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