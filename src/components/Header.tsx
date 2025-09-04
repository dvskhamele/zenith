'use client';

import { useState } from 'react';
import { Workspace } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  activeWorkspace: Workspace;
  workspaces: Workspace[];
  setActiveWorkspace: (workspace: Workspace) => void;
}

export default function Header({ 
  activeWorkspace, 
  workspaces, 
  setActiveWorkspace 
}: HeaderProps) {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setIsWorkspaceDropdownOpen(false);
      // Redirect to login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
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
        <button className="bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 text-sm">
          Post Now
        </button>
        <button className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Post
        </button>
        
        <div className="relative">
          <button onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}>
            <img 
              className="w-10 h-10 rounded-full" 
              src="https://i.pravatar.cc/40?u=director" 
              alt="User Avatar"
            />
          </button>
          
          {isWorkspaceDropdownOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {user ? (
                <>
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-slate-400">{activeWorkspace.name}</p>
                  </div>
                  
                  <p className="px-3 pt-2 pb-1 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Workspaces
                  </p>
                  
                  {workspaces.map(workspace => (
                    <a 
                      key={workspace.id}
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveWorkspace(workspace);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700"
                    >
                      <div 
                        className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-white flex-shrink-0 ${workspace.color}`}
                      >
                        {workspace.initials}
                      </div>
                      <span className="font-medium">{workspace.name}</span>
                      {activeWorkspace.id === workspace.id && (
                        <svg className="w-5 h-5 text-sky-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </a>
                  ))}
                  
                  <div className="p-2">
                    <button className="w-full text-center py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors text-sm">
                      + Add Workspace
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-slate-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-center py-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-3">
                  <p className="font-semibold">Guest</p>
                  <p className="text-sm text-slate-400">Please log in to access your workspaces</p>
                  <div className="mt-2 flex gap-2">
                    <a 
                      href="/login" 
                      className="w-full text-center py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors text-sm"
                    >
                      Login
                    </a>
                    <a 
                      href="/register" 
                      className="w-full text-center py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors text-sm"
                    >
                      Register
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}