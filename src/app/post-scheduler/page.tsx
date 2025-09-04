'use client';

import { useState, useRef } from 'react';

export default function PostScheduler() {
  const [composer, setComposer] = useState({
    text: 'This is an editable preview of the post! Type here to see the changes live.',
    template: 'twitter',
  });
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadImage = () => {
    if (previewRef.current) {
      // In a real implementation, we would use html2canvas here
      alert('In a real implementation, this would download the image using html2canvas');
    }
  };

  const shareAsText = (platform: string) => {
    const text = encodeURIComponent(composer.text);
    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=&summary=${text}`;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-slate-900 text-gray-200 min-h-screen p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Turn Your Text into a Sharable Image</h1>
          <p className="mt-2 text-lg text-slate-400">Create beautiful, professional-looking posts for social media in seconds.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* WYSIWYG Editor and Preview */}
          <div className="md:col-span-2">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div id="image-preview-area" ref={previewRef} className="p-2">
                {/* Twitter Preview */}
                {composer.template === 'twitter' ? (
                  <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                    <div className="flex items-start gap-3">
                      <img className="w-12 h-12 rounded-full" src="https://i.pravatar.cc/48?u=innovatecorp" alt="avatar" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">Innovate Corp</p>
                          <p className="text-slate-400">@innovatecorp</p>
                        </div>
                        <div 
                          contentEditable 
                          onInput={(e) => setComposer({...composer, text: e.currentTarget.textContent || ''})} 
                          className="text-white text-lg p-2 rounded-md min-h-[12rem] outline-none"
                        >
                          {composer.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Plain Text Editor */
                  <textarea 
                    value={composer.text} 
                    onChange={(e) => setComposer({...composer, text: e.target.value})} 
                    className="w-full h-56 bg-slate-900 text-white text-base p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" 
                    placeholder="What do you want to talk about?"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Options Panel */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-6 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div>
                <label className="text-sm font-medium text-slate-300">1. Select Template</label>
                <div 
                  onClick={() => setComposer({...composer, template: composer.template === 'twitter' ? null : 'twitter'})} 
                  className="mt-2 bg-slate-900/50 p-3 rounded-md cursor-pointer border-2"
                  style={{ borderColor: composer.template === 'twitter' ? '#0ea5e9' : '#334155' }}
                >
                  <p className="font-medium">Twitter Image</p>
                  <img src="https://placehold.co/300x150/0f172a/94a3b8?text=Template+Preview" className="rounded-md mt-2 border border-slate-700" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">2. Share or Download</label>
                <div className="space-y-3">
                  <button 
                    onClick={downloadImage} 
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Image
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-slate-700"></div>
                    <span className="text-xs text-slate-500">OR</span>
                    <div className="flex-1 border-t border-slate-700"></div>
                  </div>
                  <p className="text-xs text-slate-400 text-center">Share the text directly:</p>
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => shareAsText('twitter')} 
                      title="Share text on Twitter" 
                      className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => shareAsText('linkedin')} 
                      title="Share text on LinkedIn" 
                      className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.482 2.457-2.482 1.291 0 2.543.856 2.543 3.322v7.556h4.98v-10.298c0-4.836-2.904-6.702-6.485-6.702-3.582 0-5.487 1.957-5.487 1.957v-1.657z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-700">
                <button className="w-full bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-sky-600">
                  Connect Account to Post Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}