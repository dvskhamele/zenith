'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function FacebookPostPage() {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  
  const publishToFacebook = async () => {
    if (!postContent.trim()) {
      setPublishError('Please enter some content to publish');
      return;
    }
    
    setPublishing(true);
    setPublishSuccess(null);
    setPublishError(null);
    
    try {
      const response = await fetch('/api/facebook/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postContent,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPublishSuccess('Post published to Facebook successfully!');
        setPostContent('');
      } else {
        setPublishError(data.error || 'Failed to publish to Facebook');
      }
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      setPublishError('Failed to publish to Facebook. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Facebook Post</h1>
        
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create Facebook Post</h2>
          
          {publishError && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
              {publishError}
            </div>
          )}
          
          {publishSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded">
              {publishSuccess}
            </div>
          )}
          
          <div className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={4}
            />
            
            {user ? (
              <button
                onClick={publishToFacebook}
                disabled={publishing}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {publishing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Publish to Facebook
                  </>
                )}
              </button>
            ) : (
              <div>
                <p className="text-yellow-400 mb-3">Please log in to publish to Facebook</p>
                <a 
                  href="/login" 
                  className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 inline-block"
                >
                  Go to Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}