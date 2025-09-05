'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Facebook components to avoid SSR issues
const FacebookPagesManagement = dynamic(() => import('@/components/FacebookPagesManagement'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading Facebook pages...</div>
    </div>
  )
});

const FacebookPostWidget = dynamic(() => import('@/components/FacebookPostWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading Facebook post widget...</div>
    </div>
  )
});

export default function DashboardContent() {
  const [activePage, setActivePage] = useState('queue');
  const [activeSourceTab, setActiveSourceTab] = useState('drafts');
  const [posts, setPosts] = useState<Record<string, any>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [draftsAndIdeas, setDraftsAndIdeas] = useState([
    { id: 101, type: 'draft', text: 'The future of B2B marketing is community-led. Here\'s why...' },
    { id: 102, type: 'draft', text: 'Our latest case study with Acme Corp shows a 300% increase in lead generation.' },
    { id: 201, type: 'idea', text: 'A thread about the importance of brand voice.' },
    { id: 202, type: 'idea', text: 'A quick tip video for productivity.' }
  ]);
  const editorsRef = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [workspaces] = useState([
    { id: 1, name: 'Innovate Corp', initials: 'IC', color: 'bg-indigo-500' },
    { id: 2, name: 'Sunrise Coffee', initials: 'SC', color: 'bg-amber-500' }
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState({ id: 1, name: 'Innovate Corp', initials: 'IC', color: 'bg-indigo-500' });
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  // Master schedule data
  const masterSchedule = [
    { id: 1, day: 'Mondays', time: '09:00 AM', category: 'Industry News', color: 'text-sky-300' },
    { id: 2, day: 'Tuesdays', time: '02:00 PM', category: 'Product Updates', color: 'text-indigo-300' },
    { id: 3, day: 'Wednesdays', time: '11:00 AM', category: 'Evergreen Tips', color: 'text-emerald-300' },
    { id: 4, day: 'Thursdays', time: '04:00 PM', category: 'Case Studies', color: 'text-amber-300' },
    { id: 5, day: 'Fridays', time: '10:00 AM', category: 'Company Culture', color: 'text-rose-300' },
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

  const getPostContent = (postId: string) => {
    const post = posts[postId];
    if (!post || !post.text) {
      return '<span class="text-slate-500">Empty Slot - Drag content here or click to create</span>';
    }
    return post.text.replace(/\n/g, '<br>');
  };

  const editPost = (postId: string) => {
    if (!posts[postId]) {
      setPosts(prev => ({ ...prev, [postId]: { text: '', mediaUrl: null, template: null } }));
    }
    setEditingPostId(postId);
    
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
      setPosts(prev => ({ 
        ...prev, 
        [postId]: { ...prev[postId], text: editor.value } 
      }));
    }
    setEditingPostId(null);
  };

  const addToQueue = (item: any) => {
    // Find the next empty slot and add the draft
    for (const day of days) {
      for (const slot of masterSchedule) {
        const slotId = day.date + slot.id;
        if (!posts[slotId] || !posts[slotId].text) {
          setPosts(prev => ({
            ...prev,
            [slotId]: { text: item.text, mediaUrl: null, template: null }
          }));
          return;
        }
      }
    }
    alert('No empty slots found in the next 30 days!');
  };

  return (
    <div className="flex h-screen bg-slate-900 text-gray-200">
      {/* Sidebar Navigation with labeled icons */}
      <nav className="w-64 bg-slate-950 p-4 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
        <div>
          <div className="p-2 mb-6">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <h1 className="text-white text-xl font-bold ml-2">Zenith</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">Social Media Management</p>
          </div>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActivePage('queue')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'queue' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <div>
                  <div className="font-medium">Queue</div>
                  <div className="text-xs text-slate-400">Content scheduling</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('schedule')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'schedule' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <div className="font-medium">Schedule</div>
                  <div className="text-xs text-slate-400">Master schedule</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('strategy')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'strategy' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <div className="font-medium">Strategy</div>
                  <div className="text-xs text-slate-400">Audience insights</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('automation')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'automation' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
                <div>
                  <div className="font-medium">Automation</div>
                  <div className="text-xs text-slate-400">Content recycling</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('connections')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'connections' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <div>
                  <div className="font-medium">Connections</div>
                  <div className="text-xs text-slate-400">Social accounts</div>
                </div>
              </button>
            </li>
            {/* Facebook Integration Tabs */}
            <li>
              <button 
                onClick={() => setActivePage('facebook-pages')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'facebook-pages' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div>
                  <div className="font-medium">Facebook Pages</div>
                  <div className="text-xs text-slate-400">Manage pages</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('facebook-post')} 
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'facebook-post' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div>
                  <div className="font-medium">Post to Facebook</div>
                  <div className="text-xs text-slate-400">Create & publish</div>
                </div>
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button 
            onClick={() => setActivePage('settings')} 
            className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activePage === 'settings' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className=\"w-5 h-5 mr-3\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z\"></path>
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"></path>
            </svg>
            <div>
              <div className=\"font-medium\">Settings</div>
              <div className=\"text-xs text-slate-400\">Account preferences</div>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-800 flex-shrink-0 bg-slate-900">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white text-left">{activeWorkspace.name}</h1>
            <button 
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)} 
              className="text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActivePage('composer')} 
              className="bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 text-sm"
            >
              Post Now
            </button>
            <button 
              onClick={() => setActivePage('composer')} 
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Post
            </button>
            <div className="relative">
              <button onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}>
                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/40?u=director" alt="User Avatar" />
              </button>
              {isWorkspaceDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-slate-400">{activeWorkspace.name}</p>
                  </div>
                  <p className="px-3 pt-2 pb-1 text-xs text-slate-400 font-semibold uppercase tracking-wider">Workspaces</p>
                  {workspaces.map(workspace => (
                    <button 
                      key={workspace.id} 
                      onClick={() => { setActiveWorkspace(workspace); setIsWorkspaceDropdownOpen(false); }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700 w-full text-left"
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-white flex-shrink-0 ${workspace.color}`}>
                        {workspace.initials}
                      </div>
                      <span className="font-medium">{workspace.name}</span>
                      {activeWorkspace.id === workspace.id && (
                        <svg className="w-5 h-5 text-sky-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                  <div className="p-2">
                    <button className="w-full text-center py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors text-sm">
                      + Add Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {/* Queue Page */}
          {activePage === 'queue' && (
            <div className="flex h-full">
              {/* Daily Queues Timeline */}
              <div className="flex-1 p-6 overflow-y-auto">
                {days.map(day => (
                  <div key={day.date} className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-semibold text-white">{day.formatted}</h2>
                      <button 
                        onClick={() => setActivePage('composer')} 
                        className="text-sm text-slate-400 hover:text-sky-400 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg> 
                        Add Post
                      </button>
                    </div>
                    <div className="space-y-4">
                      {masterSchedule.map(slot => {
                        const postId = day.date + slot.id;
                        return (
                          <div key={slot.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-start gap-4">
                            <div className="text-center flex-shrink-0 w-24 pt-1">
                              <p className="font-mono text-sm text-slate-400">{slot.time}</p>
                              <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${slot.color}`}>
                                {slot.category}
                              </p>
                            </div>
                            {/* Optimized Post Card */}
                            <div className="flex-grow min-w-0 bg-slate-800/50 p-3 rounded-md">
                              <div className="flex gap-3">
                                <div className="flex-grow" onClick={() => editPost(postId)}>
                                  {editingPostId !== postId ? (
                                    <p 
                                      className="text-sm text-slate-300 whitespace-pre-wrap min-h-[4rem] cursor-pointer"
                                      dangerouslySetInnerHTML={{ __html: getPostContent(postId) }}
                                    ></p>
                                  ) : (
                                    <textarea
                                      ref={(el) => (editorsRef.current[postId] = el)}
                                      onBlur={() => savePost(postId)}
                                      defaultValue={posts[postId]?.text || ''}
                                      className="w-full h-24 bg-slate-700 text-white text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                    />
                                  )}
                                </div>
                                <div 
                                  onClick={() => { /* Handle media upload */ }} 
                                  className="w-20 h-20 bg-slate-700/50 rounded-md flex-shrink-0 cursor-pointer hover:bg-slate-700 flex items-center justify-center text-slate-500"
                                >
                                  {posts[postId] && posts[postId].mediaUrl ? (
                                    <img src={posts[postId].mediaUrl} className="w-full h-full object-cover rounded-md" />
                                  ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                  )}
                                  <input type="file" className="hidden" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                                <div className="flex items-center gap-3 text-slate-400">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                  </svg>
                                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.482 2.457-2.482 1.291 0 2.543.856 2.543 3.322v7.556h4.98v-10.298c0-4.836-2.904-6.702-6.485-6.702-3.582 0-5.487 1.957-5.487 1.957v-1.657z"></path>
                                  </svg>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Awaiting Approval
                                  </span>
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
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeSourceTab === 'drafts' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Drafts & Ideas
                    </button>
                    <button 
                      onClick={() => setActiveSourceTab('templates')}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeSourceTab === 'templates' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Templates
                    </button>
                    <button 
                      onClick={() => setActiveSourceTab('sources')}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeSourceTab === 'sources' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Sources
                    </button>
                  </nav>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-3">
                  {activeSourceTab === 'drafts' && (
                    <div>
                      {draftsAndIdeas.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-slate-800 p-3 rounded-md cursor-grab hover:bg-slate-700 group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${item.type === 'draft' ? 'text-sky-400' : 'text-purple-400'}`}>
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
                  
                  {activeSourceTab === 'templates' && (
                    <div>
                      <div className="bg-slate-800 p-3 rounded-md cursor-grab hover:bg-slate-700">
                        <p className="text-sm font-medium">Twitter Image Template</p>
                        <p className="text-xs text-slate-400">Drag onto a post to apply</p>
                      </div>
                    </div>
                  )}
                  
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
                        <button className="w-full bg-slate-700 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-600">
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
                        <button className="w-full bg-slate-700 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-600">
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
                        <button className="w-full bg-slate-700 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-600">
                          Generate Content
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}
          
          {/* Schedule Page */}
          {activePage === 'schedule' && (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Master Schedule</h2>
              <p className="text-slate-400 mb-6 max-w-2xl">
                Define your weekly posting cadence. The system will automatically create empty slots in your queue for you to fill.
              </p>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl space-y-6">
                {Object.entries(
                  masterSchedule.reduce((acc: Record<string, any[]>, slot) => {
                    (acc[slot.day] = acc[slot.day] || []).push(slot);
                    return acc;
                  }, {})
                ).map(([day, slots]) => (
                  <div key={day}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg text-white">{day}</h3>
                      <button className="text-sm text-slate-400 hover:text-sky-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg> 
                        Add Slot
                      </button>
                    </div>
                    <div className="space-y-3">
                      {slots.map(slot => (
                        <div key={slot.id} className="bg-slate-900/80 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input 
                              type="time" 
                              className="bg-slate-700 rounded-md p-1.5 text-sm" 
                              defaultValue="09:00" 
                            />
                            <span className="text-sm text-slate-400">Post from:</span>
                            <select className={`bg-slate-700 rounded-md p-1.5 text-sm font-medium ${slot.color}`}>
                              <option>{slot.category}</option>
                            </select>
                          </div>
                          <button className="text-slate-500 hover:text-red-400 p-2 rounded-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Strategy Page */}
          {activePage === 'strategy' && (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Audience & Strategy Analysis</h2>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Content Input</h3>
                <p className="text-sm text-slate-400 mb-4">
                  The AI will analyze your recent posts to generate an audience profile. The more content you have, the more accurate the analysis.
                </p>
                <button className="bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  Generate Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Generated Audience Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-2">Psychological Profile</h4>
                      <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
                        <li>Values authenticity & transparency.</li>
                        <li>Seeks to make ethical consumption choices.</li>
                        <li>Experiences guilt over mass-market products.</li>
                        <li>Desires a sense of connection to the products they buy.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-2">Content Themes (Bubble Chart)</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-sky-500/20 text-sky-300 font-semibold px-4 py-2 rounded-full text-lg">AI</span>
                        <span className="bg-indigo-500/20 text-indigo-300 font-semibold px-3 py-1.5 rounded-full text-md">Productivity</span>
                        <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-1 rounded-full text-sm">SaaS</span>
                        <span className="bg-rose-500/20 text-rose-300 font-semibold px-3 py-1.5 rounded-full text-md">Marketing</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">AI-Generated Marketing Copy</h3>
                  <p className="text-sm text-slate-400 mb-4">Persuasive copy based on your content themes.</p>
                  <div className="bg-slate-900/50 p-4 rounded-md">
                    <p className="font-semibold text-slate-300">Example Ad Copy:</p>
                    <p className="text-sm italic text-slate-400 mt-1">
                      "Stop guessing, start growing. Our AI-powered platform turns your marketing strategy into a self-driving engine. Boost productivity and prove your ROI. Try Autopilot free."
                    </p>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Brand Identity & Visuals</h3>
                  <p className="text-sm text-slate-400 mb-4">A recommended visual concept for your brand.</p>
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Palette</p>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0EA5E9]"></div>
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5]"></div>
                        <div className="w-8 h-8 rounded-full bg-[#10B981]"></div>
                        <div className="w-8 h-8 rounded-full bg-[#F59E0B]"></div>
                        <div className="w-8 h-8 rounded-full bg-[#F43F5E]"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Narrative</p>
                      <p className="text-sm text-slate-300">Innovative, Efficient, Data-Driven, Strategic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Automation Page */}
          {activePage === 'automation' && (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Automation Rules</h2>
              <p className="text-slate-400 mb-6 max-w-2xl">
                Create rules to automatically recycle your best content and maximize its reach.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Evergreen Content</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Automatically re-post content from selected categories when their queues are empty.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Enable Evergreen Recycling</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Top Performers</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Automatically re-queue posts that exceed a certain performance threshold.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Enable Top Performer Recycling</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Story Reposting</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Automatically post top-performing content to your stories.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Enable Story Reposting</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Connections Page */}
          {activePage === 'connections' && (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Social Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg> 
                        @innovatecorp
                      </span>
                      <span className="text-xs font-medium text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.482 2.457-2.482 1.291 0 2.543.856 2.543 3.322v7.556h4.98v-10.298c0-4.836-2.904-6.702-6.485-6.702-3.582 0-5.487 1.957-5.487 1.957v-1.657z"></path>
                        </svg> 
                        Innovate Corp
                      </span>
                      <span className="text-xs font-medium text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">App Integrations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                      <span className="flex items-center gap-2">Canva</span>
                      <span className="text-xs font-medium text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                      <span className="flex items-center gap-2">InVideo</span>
                      <button className="text-xs font-semibold bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-md">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Page */}
          {activePage === 'settings' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <p className="text-slate-400">Workspace, Team, and Billing settings will be managed here.</p>
              </div>
            </div>
          )}
          
          {/* Composer Page */}
          {activePage === 'composer' && (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl mx-auto">
                <textarea 
                  className="w-full h-40 bg-slate-900 text-white text-base p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" 
                  placeholder="What do you want to talk about?"
                ></textarea>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-slate-400">
                    <button title="Add Image/Video">
                      <svg className="w-6 h-6 hover:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                    <button title="AI Assistant">
                      <svg className="w-6 h-6 hover:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </button>
                  </div>
                  <button className="bg-sky-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-sky-600">
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Facebook Pages Management */}
          {activePage === 'facebook-pages' && (
            <div className="p-6 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Facebook Pages</h2>
              <FacebookPagesManagement />
            </div>
          )}
          
          {/* Facebook Post Widget */}
          {activePage === 'facebook-post' && (
            <div className="p-6 overflow-y-auto h-full max-w-4xl mx-auto w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Post to Facebook</h2>
              <FacebookPostWidget />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}