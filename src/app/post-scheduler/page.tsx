'use client';

import { useState } from 'react';

export default function PostScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [scheduledContent, setScheduledContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Schedule a post
  const schedulePost = () => {
    if (!scheduledContent.trim() || !scheduledDate || !scheduledTime) {
      setError('Please enter post content and select date/time');
      return;
    }

    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (dateTime < new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    const newPost = {
      id: Date.now(),
      content: scheduledContent,
      scheduledFor: dateTime,
      status: 'scheduled'
    };

    setScheduledPosts([...scheduledPosts, newPost]);
    setScheduledContent('');
    setSuccess('Post scheduled successfully!');
    
    // In a real app, you would save this to a database
    // and set up a cron job or background task to publish at the scheduled time
  };

  // Delete a scheduled post
  const deleteScheduledPost = (id: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Post Scheduler</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded">
            {success}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule New Post</h2>
          <div className="space-y-4">
            <div>
              <textarea
                value={scheduledContent}
                onChange={(e) => setScheduledContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            
            <button
              onClick={schedulePost}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Post'}
            </button>
          </div>
        </div>
        
        {scheduledPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Scheduled Posts</h2>
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-4 bg-slate-700 rounded">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white">{post.content}</p>
                      <p className="text-sm text-slate-400 mt-2">
                        Scheduled for: {post.scheduledFor.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteScheduledPost(post.id)}
                      className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}