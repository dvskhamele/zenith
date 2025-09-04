'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function WebinarPage() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set email from logged-in user if available
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration process
    try {
      // In a real app, you would send this to your backend
      console.log('Registering for webinar with email:', email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('There was an error registering for the webinar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-gray-900">BrandName</a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            {user ? (
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            ) : (
              <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16 text-center">
        <section id="hero-webinar" className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Free Webinar: Master Social Media Automation in 60 Minutes
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Learn the secrets to consistent posting, audience growth, and effortless content management.
          </p>
          
          {isRegistered ? (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
              <p className="text-gray-700 mb-4">
                Thank you for registering, {user ? user.email : email}! You'll receive a confirmation email shortly with details on how to join the webinar.
              </p>
              <a 
                href="/dashboard" 
                className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Automate Your Content Pipeline:</strong> Discover how to schedule weeks of content in minutes.</li>
                <li><strong>AI-Powered Content Creation:</strong> Unleash AI to generate ideas, captions, and repurpose content.</li>
                <li><strong>Growth Hacking Strategies:</strong> Implement auto-plug, auto-DM, and evergreen content tactics.</li>
                <li><strong>Prove Your ROI:</strong> Understand how to generate automated reports that showcase real business impact.</li>
              </ul>
              
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label htmlFor="email-webinar" className="block text-sm font-medium text-gray-700 mb-2">
                    {user ? "Your Registration Email" : "Register for Free"}
                  </label>
                  <input 
                    type="email" 
                    id="email-webinar" 
                    name="email-webinar" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="your.email@example.com"
                    required
                    disabled={!!user} // Disable if user is logged in
                  />
                  {user && (
                    <p className="text-sm text-gray-500 mt-1">
                      Using your account email. <a href="/dashboard" className="text-indigo-600 hover:underline">Not you?</a>
                    </p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg mt-6 hover:bg-indigo-700 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Registering..." : "Register Now →"}
                </button>
              </form>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">Limited spots available. Reserve yours today!</p>
        </section>

        <section id="webinar-details" className="pt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Webinar Details</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Join industry experts to transform your social media strategy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Date & Time</h3>
              <p className="text-gray-700">September 15, 2025 | 10:00 AM PST</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Speakers</h3>
              <p className="text-gray-700">Leading Social Media Strategists & Automation Experts</p>
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