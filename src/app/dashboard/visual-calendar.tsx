'use client';

import { useState, useEffect, useRef } from 'react';

export default function VisualCalendar() {
  const [posts, setPosts] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<Record<string, boolean>>({});
  const [activeSourceTab, setActiveSourceTab] = useState<'drafts' | 'templates' | 'sources' | 'frequency'>('drafts');
  const [draftsAndIdeas, setDraftsAndIdeas] = useState([
    { id: 101, type: 'draft' as const, text: 'The future of B2B marketing is community-led. Here\'s why...' },
    { id: 102, type: 'draft' as const, text: 'Our latest case study with Acme Corp shows a 300% increase in lead generation.' },
    { id: 201, type: 'idea' as const, text: 'A thread about the importance of brand voice.' },
    { id: 202, type: 'idea' as const, text: 'A quick tip video for productivity.' }
  ]);
  const editorsRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Master schedule data
  const masterSchedule = [
    { id: 1, day: 'Mondays', time: '09:00 AM', category: 'Industry News', color: 'text-sky-300' },
    { id: 2, day: 'Tuesdays', time: '02:00 PM', category: 'Product Updates', color: 'text-indigo-300' },
    { id: 3, day: 'Wednesdays', time: '11:00 AM', category: 'Evergreen Tips', color: 'text-emerald-300' },
    { id: 4, day: 'Thursdays', time: '04:00 PM', category: 'Case Studies', color: 'text-amber-300' },
    { id: 5, day: 'Fridays', time: '10:00 AM', category: 'Company Culture', color: 'text-rose-300' },
  ];

  // Content categories
  const contentCategories = [
    { name: 'Industry News', color: 'bg-sky-500/20 text-sky-300' },
    { name: 'Product Updates', color: 'bg-indigo-500/20 text-indigo-300' },
    { name: 'Evergreen Tips', color: 'bg-emerald-500/20 text-emerald-300' },
    { name: 'Case Studies', color: 'bg-amber-500/20 text-amber-300' },
    { name: 'Company Culture', color: 'bg-rose-500/20 text-rose-300' },
    { name: 'Customer Stories', color: 'bg-purple-500/20 text-purple-300' },
    { name: 'Behind the Scenes', color: 'bg-cyan-500/20 text-cyan-300' },
    { name: 'Promotions', color: 'bg-pink-500/20 text-pink-300' },
  ];

  // Generate dates for the next 30 days
  const generateDays = (numDays: number) => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < numDays; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    }
    
    return days;
  };

  const days = generateDays(30);

  const editPost = (postId: string, currentText: string) => {
    // Close any other open editors
    setEditingPost({});
    // Set current post to editing mode
    setEditingPost(prev => ({ ...prev, [postId]: true }));
    // If the post is empty, populate with placeholder
    if (!posts[postId]) {
      setPosts(prev => ({ ...prev, [postId]: currentText }));
    }
    
    // Focus the textarea after it renders
    setTimeout(() => {
      if (editorsRef.current[postId]) {
        editorsRef.current[postId]?.focus();
        editorsRef.current[postId]?.select();
      }
    }, 0);
  };

  const savePost = (postId: string) => {
    const editor = editorsRef.current[postId];
    if (editor) {
      setPosts(prev => ({ ...prev, [postId]: editor.value }));
    }
    setEditingPost(prev => ({ ...prev, [postId]: false }));
  };

  const handleImageDrop = (e: React.DragEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPosts(prev => ({ ...prev, [postId]: event.target?.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, type: 'content' | 'template', item: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, item }));
  };

  const addToQueue = (item: any) => {
    // This would be implemented based on your specific requirements
    console.log('Adding to queue:', item);
  };

  return (
    <div className="flex h-full">
      {/* Daily Queues Timeline */}
      <div className="flex-1 p-6 overflow-y-auto">
        {days.map((day) => (
          <div key={day.date} className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">{day.formatted}</h2>
            <div className="space-y-3">
              {masterSchedule.map((slot) => {
                const postId = day.date + slot.id;
                return (
                  <div key={slot.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-start gap-4">
                    <div 
                      className="text-center flex-shrink-0 w-24 cursor-pointer"
                      onClick={() => editPost(postId, 'New post content...')}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageDrop(e, postId);
                      }}
                    >
                      <p className="font-mono text-sm text-slate-400">{slot.time}</p>
                      <p className={`text-xs font-semibold mt-1 ${slot.color}`}>{slot.category}</p>
                      {posts[postId] && posts[postId].startsWith('data:image') ? (
                        <div className="mt-2 w-16 h-16 mx-auto rounded border border-slate-600 overflow-hidden">
                          <img 
                            src={posts[postId]} 
                            alt="Post content" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 w-16 h-16 mx-auto rounded border-2 border-dashed border-slate-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      {/* Click-to-edit Card */}
                      <div 
                        onClick={() => editPost(postId, 'New post content...')}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleImageDrop(e, postId);
                        }}
                        className="bg-slate-900/50 p-3 rounded-md h-24 cursor-pointer hover:bg-slate-700 transition-colors"
                      >
                        {!editingPost[postId] ? (
                          posts[postId] && posts[postId].startsWith('data:image') ? (
                            // Display dropped image
                            <div className="w-full h-full flex items-center justify-center">
                              <img 
                                src={posts[postId]} 
                                alt="Dropped content" 
                                className="max-h-full max-w-full object-contain rounded"
                              />
                            </div>
                          ) : posts[postId] ? (
                            // Display text content
                            <p className="text-sm text-slate-300 text-center">
                              {posts[postId]}
                            </p>
                          ) : (
                            // Empty state with instructions
                            <div className="text-center">
                              <p className="text-sm text-slate-300">
                                Empty Slot
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Click to create or drag image here
                              </p>
                            </div>
                          )
                        ) : (
                          <textarea
                            ref={(el) => (editorsRef.current[postId] = el)}
                            onBlur={() => savePost(postId)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                savePost(postId);
                              }
                            }}
                            className="w-full h-full bg-slate-700 text-white text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                            defaultValue={posts[postId]}
                          />
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400">Tags:</span>
                        <div className="flex gap-2">
                          <span className="bg-sky-500/20 text-sky-300 px-2 py-1 rounded-full text-xs">#marketing</span>
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs">#b2b</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Content Sources Panel */}
      <aside className="w-80 bg-slate-950/50 border-l border-slate-800 p-4 flex-shrink-0 flex flex-col">
        <div className="border-b border-slate-700 mb-4">
          <nav className="-mb-px flex space-x-4">
            <button 
              onClick={() => setActiveSourceTab('drafts')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeSourceTab === 'drafts' 
                  ? 'border-sky-400 text-sky-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Drafts & Ideas
            </button>
            <button 
              onClick={() => setActiveSourceTab('templates')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeSourceTab === 'templates' 
                  ? 'border-sky-400 text-sky-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveSourceTab('sources')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeSourceTab === 'sources' 
                  ? 'border-sky-400 text-sky-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Sources
            </button>
            <button 
              onClick={() => setActiveSourceTab('frequency')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeSourceTab === 'frequency' 
                  ? 'border-sky-400 text-sky-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Frequency
            </button>
          </nav>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-3">
          {/* Drafts & Ideas Tab */}
          {activeSourceTab === 'drafts' && (
            <div>
              {draftsAndIdeas.map((item) => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'content', item)}
                  className="bg-slate-800 p-3 rounded-md cursor-grab hover:bg-slate-700 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        item.type === 'draft' ? 'text-sky-400' : 'text-purple-400'
                      }`}>
                        {item.type}
                      </p>
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                    <button 
                      onClick={() => addToQueue(item)}
                      title="Add to Queue"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-sky-400 ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Templates Tab */}
          {activeSourceTab === 'templates' && (
            <div>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'template', {name: 'twitter'})}
                className="bg-slate-800 p-3 rounded-md cursor-grab hover:bg-slate-700"
              >
                <p className="text-sm font-medium">Twitter Image Template</p>
                <p className="text-xs text-slate-400">Drag onto a post to apply</p>
              </div>
            </div>
          )}
          
          {/* Sources Tab */}
          {activeSourceTab === 'sources' && (
            <div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Bulk CSV Upload
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-2">Upload a CSV to fill your queues instantly.</p>
                <button className="w-full bg-sky-500 text-white text-xs font-bold py-2 rounded-md hover:bg-sky-600">
                  Upload CSV
                </button>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM9.5 4h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5zm-3 0h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5zm-3 0h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5zm-1.5 7h11a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                  Google Sheets Sync
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-2">Connect a sheet to keep your content in sync.</p>
                <button className="w-full bg-green-500 text-white text-xs font-bold py-2 rounded-md hover:bg-green-600">
                  Connect Sheet
                </button>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  AI Content Generator
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-2">Generate a week of posts from a single idea.</p>
                <button className="w-full bg-purple-500 text-white text-xs font-bold py-2 rounded-md hover:bg-purple-600">
                  Generate Content
                </button>
              </div>
            </div>
          )}
          {activeSourceTab === 'frequency' && (
            <div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Frequency Settings
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-2">Configure post frequency for each category.</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}