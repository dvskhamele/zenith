'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname };
import dynamic from 'next/dynamic';

// Dynamically import the VisualCalendar component
const VisualCalendar = dynamic(() => import('./visual-calendar'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-white text-lg">Loading calendar...</div>
    </div>
  )
});

// Dynamically import Facebook components
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get active tab from URL or default to 'calendar'
  const getActiveTab = () => {
    const tab = searchParams.get('tab');
    if (tab && ['calendar', 'schedule', 'strategy', 'automation', 'connections', 'facebook-pages', 'facebook-post', 'settings', 'composer'].includes(tab)) {
      return tab;
    }
    return 'calendar';
  };
  
  const [activePage, setActivePage] = useState(getActiveTab);
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

  // Update active tab when URL changes
  useEffect(() => {
    setActivePage(getActiveTab());
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActivePage(tab);
    router.push(`${pathname}?tab=${tab}`);
  };

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
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-950 p-4 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
        <div>
          <div className="p-2 mb-10">
            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => handleTabChange('queue')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'queue' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Queue</div>
                  <div className="text-xs text-gray-400">Scheduled posts</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('schedule')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'schedule' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Schedule</div>
                  <div className="text-xs text-gray-400">Posting times</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('strategy')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'strategy' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Strategy</div>
                  <div className="text-xs text-gray-400">Audience & AI</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('automation')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'automation' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Automation</div>
                  <div className="text-xs text-gray-400">Recycling rules</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('connections')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'connections' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Connections</div>
                  <div className="text-xs text-gray-400">Social accounts</div>
                </div>
              </button>
            </li>
            {/* Facebook Integration Tabs */}
            <li>
              <button 
                onClick={() => handleTabChange('facebook-pages')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'facebook-pages' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Facebook Pages</div>
                  <div className="text-xs text-gray-400">Manage your pages</div>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange('facebook-post')} 
                className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'facebook-post' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div className="ml-3">
                  <div className="font-medium">Post to Facebook</div>
                  <div className="text-xs text-gray-400">Create and publish</div>
                </div>
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button 
            onClick={() => setActivePage('settings')} 
            className={`w-full text-left px-6 py-3 rounded-md flex items-center ${activePage === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <div className="ml-3">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-400">Account preferences</div>
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

        {/* Page Content Wrapper with consistent padding */}
        <div className="flex-1 overflow-auto p-8">
          
      </main>
    </div>
  );
}