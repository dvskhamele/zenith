'use client';

import { useState } from 'react';
import { DraftIdea } from '@/types';

interface ContentSourcesPanelProps {
  activeSourceTab: string;
  setActiveSourceTab: (tab: string) => void;
  draftsAndIdeas: DraftIdea[];
  editingDraftId: string | null; // Changed to string to match UUID
  setEditingDraftId: (id: string | null) => void;
  addToQueue: (draft: DraftIdea) => void;
  handleDragStart: (event: React.DragEvent, type: string, data: any) => void;
}

export default function ContentSourcesPanel({
  activeSourceTab,
  setActiveSourceTab,
  draftsAndIdeas,
  editingDraftId,
  setEditingDraftId,
  addToQueue,
  handleDragStart
}: ContentSourcesPanelProps) {
  // Local state for draft text editing
  const [draftTexts, setDraftTexts] = useState<Record<string, string>>({});

  const handleDraftTextChange = (id: string, text: string) => {
    setDraftTexts(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const handleDraftBlur = (id: string) => {
    // In a real app, you would update the database here
    setEditingDraftId(null);
  };

  return (
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
        </nav>
      </div>
      
      <div className="flex-grow overflow-y-auto space-y-3">
        {activeSourceTab === 'drafts' && (
          <div>
            {draftsAndIdeas.map(item => (
              <div 
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, 'content', item)}
                className="bg-slate-800 p-3 rounded-md cursor-grab card-hover-effect group"
              >
                <div className="flex justify-between items-start">
                  <div 
                    className="flex-grow"
                    onClick={() => setEditingDraftId(item.id)}
                  >
                    <p 
                      className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        item.type === 'draft' ? 'text-sky-400' : 'text-purple-400'
                      }`}
                    >
                      {item.type}
                    </p>
                    {editingDraftId !== item.id ? (
                      <p className="text-sm font-medium">{item.text}</p>
                    ) : (
                      <textarea
                        value={draftTexts[item.id] || item.text}
                        onChange={(e) => handleDraftTextChange(item.id, e.target.value)}
                        onBlur={() => handleDraftBlur(item.id)}
                        autoFocus
                        className="w-full bg-slate-700 text-sm p-1 rounded"
                      />
                    )}
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
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'template', {name: 'twitter'})}
              className="bg-slate-800 p-3 rounded-md cursor-grab card-hover-effect"
            >
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
              <button className="mt-2 w-full bg-slate-700 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-600">
                Upload CSV
              </button>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM9.5 4h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5zm-3 0h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5zm-3 0h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5zm-1.5 7h11a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5z"/>
                </svg>
                Google Sheets Sync
              </h4>
              <button className="mt-2 w-full bg-slate-700 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-600">
                Connect Sheet
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}