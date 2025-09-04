'use client';

import Link from 'next/link';

export default function AIAssistantPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">BrandName</Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 text-center">
        <section id="hero-ai-assistant" className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Unleash Your Creativity with Our AI Content Assistant
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Generate endless post ideas, craft engaging captions, and repurpose content effortlessly with AI.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Personal Content Co-Pilot.</h2>
            <p className="text-gray-700 mb-4">
              Overcome writer's block and produce high-quality content at scale. Our AI assistant helps you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Generate Post Ideas:</strong> From a single prompt, get dozens of fresh content concepts.</li>
              <li><strong>Craft Engaging Captions:</strong> Create compelling copy tailored for each social platform.</li>
              <li><strong>Automated Content Repurposing:</strong> Transform blog posts into tweets, or tweets into images, instantly.</li>
            </ul>
            <Link href="/login" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg mt-6 hover:bg-indigo-700 transition-colors text-lg flex items-center justify-center">
              Start Generating Content &rarr;
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Available with Marketer and Agency plans.</p>
        </section>

        <section id="how-it-works" className="pt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Simple steps to supercharge your content creation process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Provide a Prompt</h3>
              <p className="text-gray-700">Give the AI a topic, a keyword, or a piece of existing content.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Generate Ideas</h3>
              <p className="text-gray-700">Receive a variety of post ideas, captions, and content variations instantly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Publish & Optimize</h3>
              <p className="text-gray-700">Select your favorite, fine-tune, and schedule directly to your social channels.</p>
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