'use client';

import { useState } from 'react';
import { facebookService } from '@/services/facebookService';

export default function FacebookPostWidget() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<{success?: string; error?: string} | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  // Mock Facebook pages data (in a real app, this would come from the API)
  const [facebookPages] = useState([
    { id: 'page1', name: 'My Business Page', selected: true },
    { id: 'page2', name: 'My Personal Page', selected: false }
  ]);

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
      
      // If we have an image, we need to upload it first
      if (image) {
        // In a real app, we would convert the text to an image here
        // For now, we'll just simulate the process
        console.log('Converting text to image and uploading...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      }
      
      // Publish to Facebook using the service
      const response = await facebookService.publishPost(content, undefined, token);
      
      console.log('Published successfully:', response);
      setResult({ success: 'Post published to Facebook successfully!' });
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      setResult({ error: error.message || 'Failed to publish to Facebook. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const convertTextToImage = async () => {
    if (!content.trim()) {
      setResult({ error: 'Please enter some content to convert to image' });
      return;
    }

    try {
      setResult({ success: 'Converting text to image...' });
      
      // In a real app, we would use an image generation service here
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      // Create a simple data URL for demonstration
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a simple gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#4F46E5');
        gradient.addColorStop(1, '#7C3AED');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Generated Post Image', canvas.width/2, canvas.height/2);
        
        ctx.font = '24px Arial';
        ctx.fillText(content.substring(0, 50) + (content.length > 50 ? '...' : ''), canvas.width/2, canvas.height/2 + 50);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        setResult({ success: 'Image generated successfully!' });
      }
    } catch (error) {
      console.error('Error converting text to image:', error);
      setResult({ error: 'Failed to generate image. Please try again.' });
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Post to Facebook</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Post Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Image (Optional)</label>
        <div className="flex gap-2">
          <label className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-center cursor-pointer hover:bg-slate-600 transition-colors">
            <svg className="w-6 h-6 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-slate-300 text-sm">Upload Image</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <button 
            onClick={convertTextToImage}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span className="text-sm">AI Image</span>
          </button>
        </div>
      </div>
      
      {image && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Preview</label>
          <div className="relative">
            <img 
              src={image} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg border border-slate-600"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Facebook Pages</label>
        <div className="space-y-2">
          {facebookPages.map(page => (
            <div key={page.id} className="flex items-center">
              <input
                type="checkbox"
                id={`page-${page.id}`}
                checked={page.selected}
                onChange={() => {
                  // Toggle page selection
                }}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor={`page-${page.id}`} className="ml-2 text-slate-300">
                {page.name}
              </label>
            </div>
          ))}
        </div>
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
      
      <div className="flex gap-2">
        <button
          onClick={() => {
            setContent('');
            setImage(null);
            setResult(null);
          }}
          className="flex-1 bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-500"
        >
          Clear
        </button>
        <button
          onClick={publishToFacebook}
          disabled={posting || (!content.trim() && !image)}
          className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {posting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
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
    </div>
  );
}