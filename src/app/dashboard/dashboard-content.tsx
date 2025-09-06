'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Dynamically import the VisualCalendar component
import dynamic from 'next/dynamic';

const VisualCalendar = dynamic(() => import('./visual-calendar'), { ssr: false });


// Reusable Sidebar Item Component
function SidebarItem({ tab, label, description, icon, activePage, handleTabChange }: any) {
  return (
    <button
      onClick={() => handleTabChange(tab)}
      className={`w-full text-left px-6 py-3 rounded-md flex items-center ${
        activePage === tab ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
    >
      {icon}
      <div className="ml-3">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
    </button>
  );
}

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activePage, setActivePage] = useState(searchParams.get('tab') || 'calendar');
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: string) => {
    setActivePage(tab);
    router.push(`${pathname}?tab=${tab}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        workspaceDropdownRef.current &&
        !workspaceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWorkspaceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-gray-200">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-950 p-4 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
        <div>
          {/* Workspace Section */}
          <div ref={workspaceDropdownRef} className="relative mb-6">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center justify-between"
            >
              <span className="font-medium">Workspace</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isWorkspaceDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isWorkspaceDropdownOpen && (
              <div className="absolute mt-2 w-full bg-slate-800 rounded-md shadow-lg z-50">
                <button className="block w-full text-left px-4 py-2 hover:bg-slate-700">Workspace 1</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-slate-700">Workspace 2</button>
              </div>
            )}
          </div>

          {/* Sidebar Items */}
          <SidebarItem
            tab="calendar"
            label="Calendar"
            description="Content scheduling"
            activePage={activePage}
            handleTabChange={handleTabChange}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            }
          />

          <SidebarItem
            tab="facebook-pages"
            label="Facebook Pages"
            description="Manage your pages"
            activePage={activePage}
            handleTabChange={handleTabChange}
            icon={<i className="fab fa-facebook w-5 h-5"></i>}
          />

          <SidebarItem
            tab="facebook-post"
            label="Facebook Post"
            description="Publish instantly"
            activePage={activePage}
            handleTabChange={handleTabChange}
            icon={<i className="fas fa-pencil-alt w-5 h-5"></i>}
          />
        </div>

        {/* User Dropdown */}
        <div ref={userDropdownRef} className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            <img src="/avatar.png" alt="User Avatar" className="w-8 h-8 rounded-full mr-3" />
            <span className="font-medium">John Doe</span>
          </button>
          {isUserDropdownOpen && (
            <div className="absolute bottom-12 left-0 w-full bg-slate-800 rounded-md shadow-lg z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-slate-700">Settings</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-slate-700">Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === 'calendar' && <VisualCalendar />}
        {activePage === 'facebook-pages' && <div>Facebook Pages Management</div>}
        {activePage === 'facebook-post' && <div>Create Facebook Post</div>}
      </main>
    </div>
  );
}
