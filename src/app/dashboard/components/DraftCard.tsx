import React, { useRef } from 'react';

interface DraftCardProps {
  item: {
    id: number;
    type: 'draft' | 'idea';
    text: string;
    category: string;
    image?: string;
  };
  onEdit: (itemId: number, newText: string) => void;
  onImageDrop: (itemId: number, imageData: string) => void;
  onAddToQueue: (item: any) => void;
}

export default function DraftCard({ 
  item, 
  onEdit, 
  onImageDrop, 
  onAddToQueue 
}: DraftCardProps) {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageDrop(item.id, event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div 
      key={item.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'content', item }));
        e.currentTarget.classList.add('cursor-grabbing');
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('cursor-grabbing');
      }}
      className="bg-slate-800 p-3 rounded-md cursor-grab hover:bg-slate-700 group"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleImageDrop}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              item.type === 'draft' ? 'text-sky-400' : 'text-purple-400'
            }`}>
              {item.type}
            </p>
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
              {item.category}
            </span>
          </div>
          {item.image ? (
            <div className="mb-2">
              <img 
                src={item.image} 
                alt="Card content" 
                className="w-full h-32 object-cover rounded"
              />
            </div>
          ) : null}
          <div 
            ref={contentEditableRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="text-sm font-medium p-1 rounded hover:bg-slate-700 focus:bg-slate-700 focus:outline-none cursor-text"
            onBlur={(e) => {
              onEdit(item.id, e.currentTarget.innerText);
            }}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        </div>
        <button 
          onClick={() => onAddToQueue(item)}
          title="Add to Queue"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-sky-400 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}