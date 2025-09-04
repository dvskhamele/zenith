'use client';

import { Post } from '@/types';
import React from 'react';

interface PostCardProps {
  postId: string;
  post: Post | undefined;
  editingPostId: string | null;
  setEditingPostId: (id: string | null) => void;
  updatePostText: (postId: string, text: string) => void;
  handleDrop: (slotId: string, event: React.DragEvent) => void;
}

export default function PostCard({
  postId,
  post,
  editingPostId,
  setEditingPostId,
  updatePostText,
  handleDrop
}: PostCardProps) {
  const handleEdit = () => {
    if (!post) {
      // Initialize post if it doesn't exist
      updatePostText(postId, '');
    }
    setEditingPostId(postId);
  };

  const handleSave = () => {
    setEditingPostId(null);
  };

  const getPostContent = () => {
    if (!post || !post.text) {
      return <span className="text-slate-500">Empty Slot - Drag content here or click to create</span>;
    }
    return post.text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div 
      onDrop={(e) => handleDrop(postId, e)}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('drag-over');
      }}
      className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-start gap-4 transition-colors"
    >
      <div className="flex-grow min-w-0 bg-slate-800/50 p-3 rounded-md">
        <div className="flex gap-3">
          <div className="flex-grow" onClick={handleEdit}>
            {editingPostId !== postId ? (
              <p className="text-sm text-slate-300 whitespace-pre-wrap min-h-[4rem] cursor-pointer">
                {getPostContent()}
              </p>
            ) : (
              <textarea
                value={post?.text || ''}
                onChange={(e) => updatePostText(postId, e.target.value)}
                onBlur={handleSave}
                autoFocus
                className="w-full h-24 bg-slate-700 text-white text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            )}
          </div>
          
          <div 
            className="w-20 h-20 bg-slate-700/50 rounded-md flex-shrink-0 cursor-pointer hover:bg-slate-700 flex items-center justify-center text-slate-500"
          >
            {post?.mediaUrl ? (
              <img src={post.mediaUrl} className="w-full h-full object-cover rounded-md" />
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <input type="file" className="hidden" />
              </>
            )}
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
}