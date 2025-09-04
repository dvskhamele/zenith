'use client';

import React from 'react';

export default function AutomatedReportsPage() {
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
        <section id="hero-reports" className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Automated Reports: Prove Your Social Media ROI
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tired of spending hours compiling social media reports? Our Automated Reports tool transforms tedious data collection into effortless insights. Automatically generate and email comprehensive performance reports to clients and internal stakeholders on a weekly or monthly basis. We focus on business-impact metrics, translating your social media efforts into tangible ROI. Gain proactive, AI-driven recommendations to optimize your strategy and clearly demonstrate the value of your work. Stop the manual grind and start proving your social media success with automated precision.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Effortless Insights, Every Time.</h2>
            <p className="text-gray-700 mb-4">
              Our intelligent reporting engine translates your social media performance into business impact, automatically.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Goal-Oriented Dashboards:</strong> See performance against your specific business objectives at a glance.</li>
              <li><strong>White-Labeled PDFs:</strong> Deliver professional, branded reports to clients or stakeholders with zero effort.</li>
              <li><strong>Proactive Recommendations:</strong> AI-driven insights tell you what's working and how to optimize your strategy.</li>
            </ul>
            <a href="/login" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg mt-6 hover:bg-indigo-700 transition-colors text-lg flex items-center justify-center">
              See Your Data Work For You &rarr;
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">Available with Marketer and Agency plans.</p>
        </section>

        <section id="benefits" className="pt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Reporting</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            From tedious data compilation to strategic decision-making.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-700">Automate report generation and delivery, freeing up valuable time for analysis.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prove ROI</h3>
              <p className="text-gray-700">Clearly demonstrate the business impact of your social media efforts with tangible metrics.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimize Strategy</h3>
              <p className="text-gray-700">Gain actionable insights to refine your content and engagement strategies.</p>
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