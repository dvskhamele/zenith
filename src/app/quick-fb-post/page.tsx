'use client';

import { useState } from 'react';

export default function QuickFacebookPost() {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState('');

  const publishToFacebook = async () => {
    if (!postContent.trim()) {
      setResult('Please enter some content to publish');
      return;
    }

    setIsPosting(true);
    setResult('Publishing...');

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
        setResult('Post published to Facebook successfully!');
        setPostContent('');
      } else {
        setResult(`Error: ${data.error || 'Failed to publish to Facebook'}`);
      }
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      setResult('Error: Failed to publish to Facebook. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Quick Facebook Post</h1>
        
        <div className="space-y-4">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          
          <button
            onClick={publishToFacebook}
            disabled={isPosting || !postContent.trim()}
            className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPosting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing to Facebook...
              </>
            ) : (
              'Post to Facebook'
            )}
          </button>
          
          {result && (
            <div className={`p-3 rounded text-center ${
              result.includes('successfully') 
                ? 'bg-green-500/20 text-green-300' 
                : result.includes('Error') || result.includes('Failed')
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-slate-700 text-white'
            }`}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}