'use client';

import { ScheduleSlotUI, Post } from '@/types';
import PostCard from '@/components/PostCard';
import React from 'react';

interface DailyQueueProps {
  date: string;
  formattedDate: string;
  masterSchedule: ScheduleSlotUI[];
  posts: Record<string, Post>;
  editingPostId: string | null;
  setEditingPostId: (id: string | null) => void;
  updatePostText: (postId: string, text: string) => void;
  handleDrop: (slotId: string, event: React.DragEvent) => void;
  setActivePage: (page: string) => void;
}

export default function DailyQueue({
  date,
  formattedDate,
  masterSchedule,
  posts,
  editingPostId,
  setEditingPostId,
  updatePostText,
  handleDrop,
  setActivePage
}: DailyQueueProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">{formattedDate}</h2>
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
          const slotId = date + slot.id;
          const post = posts[slotId];
          
          return (
            <div key={slotId} className="flex">
              <div className="text-center flex-shrink-0 w-24 pt-1">
                <p className="font-mono text-sm text-slate-400">{slot.time}</p>
                <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${slot.color}`}>
                  {slot.category}
                </p>
              </div>
              
              <PostCard
                postId={slotId}
                post={post}
                editingPostId={editingPostId}
                setEditingPostId={setEditingPostId}
                updatePostText={updatePostText}
                handleDrop={handleDrop}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}