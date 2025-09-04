'use client';

import { useState } from 'react';
import { facebookService } from '@/services/facebookService';

export default function FacebookPostWidget() {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<{success?: string; error?: string} | null>(null);

  const publishToFacebook = async () => {
    if (!content.trim()) {
      setResult({ error: 'Please enter some content to publish' });
      return;
    }

    setPosting(true);
    setResult(null);

    try {
      console.log('Publishing to Facebook...');
      
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('facebook_access_token') : null;
      
      // Publish to Facebook using the service
      const response = await facebookService.publishPost(content, undefined, token);
      
      console.log('Published successfully:', response);
      setResult({ success: 'Post published to Facebook successfully!' });
      setContent('');
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      setResult({ error: error.message || 'Failed to publish to Facebook. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Post to Facebook</h3>
      
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
      
      {result && (
        <div className={`mb-4 p-3 rounded-lg ${
          result.success 
            ? 'bg-green-500/20 text-green-300' 
            : 'bg-red-500/20 text-red-300'
        }`}>
          {result.success || result.error}
        </div>
      )}
      
      <button
        onClick={publishToFacebook}
        disabled={posting || !content.trim()}
        className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {posting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Posting to Facebook...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Post to Facebook
          </>
        )}
      </button>
    </div>
  );
}