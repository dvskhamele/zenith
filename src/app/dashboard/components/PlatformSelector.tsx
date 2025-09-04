import React from 'react';

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  selected: boolean;
}

interface PlatformSelectorProps {
  platforms?: Platform[];
  onPlatformToggle?: (platformId: string) => void;
  className?: string;
}

const defaultPlatforms: Platform[] = [
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ), 
    selected: true 
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ), 
    selected: true 
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.98v16h4.98v-8.396c0-2.002 1.809-2.482 2.457-2.482 1.291 0 2.543.856 2.543 3.322v7.556h4.98v-10.298c0-4.836-2.904-6.702-6.485-6.702-3.582 0-5.487 1.957-5.487 1.957v-1.657z" />
      </svg>
    ), 
    selected: false 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ), 
    selected: false 
  }
];

export default function PlatformSelector({ 
  platforms = defaultPlatforms, 
  onPlatformToggle,
  className = ''
}: PlatformSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((platform) => (
        <div 
          key={platform.id}
          onClick={() => {
            if (onPlatformToggle) {
              onPlatformToggle(platform.id);
            }
          }}
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
            platform.selected 
              ? 'bg-slate-700 border border-sky-500' 
              : 'bg-slate-900/50 border border-slate-700'
          }`}
        >
          {platform.icon}
          <span className="text-xs font-medium">{platform.name}</span>
        </div>
      ))}
    </div>
  );
}