// Template components for different social media formats with Facebook page details

import { useState } from 'react';

export const TwitterTemplate = ({ 
  text, 
  facebookPage, 
  editable = false, 
  onTextChange 
}: { 
  text: string; 
  facebookPage?: any;
  editable?: boolean; 
  onTextChange?: (text: string) => void;
}) => {
  // Use Facebook page details if available, otherwise use defaults
  const pageName = facebookPage?.name || 'Your Page';
  const pageUsername = facebookPage?.username || 'yourpage';
  const pagePicture = facebookPage?.picture?.data?.url || 'https://i.pravatar.cc/48?u=yourpage';

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
      <div className="flex items-start gap-3">
        <img 
          className="w-12 h-12 rounded-full" 
          src={pagePicture} 
          alt={pageName}
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white">{pageName}</p>
            <p className="text-slate-400">@{pageUsername}</p>
          </div>
          {editable ? (
            <div 
              contentEditable
              onInput={(e) => {
                const target = e.target as HTMLElement;
                onTextChange?.(target.innerText);
              }}
              className="text-white text-lg p-2 rounded-md min-h-[12rem] focus:outline-none focus:ring-2 focus:ring-sky-500"
              dangerouslySetInnerHTML={{ __html: text }}
            ></div>
          ) : (
            <div className="text-white text-lg p-2 rounded-md min-h-[12rem]">
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const LinkedInTemplate = ({ 
  text, 
  facebookPage,
  editable = false, 
  onTextChange 
}: { 
  text: string; 
  facebookPage?: any;
  editable?: boolean; 
  onTextChange?: (text: string) => void;
}) => {
  // Use Facebook page details if available, otherwise use defaults
  const pageName = facebookPage?.name || 'Your Page';
  const pageUsername = facebookPage?.username || 'yourpage';
  const pagePicture = facebookPage?.picture?.data?.url || 'https://i.pravatar.cc/48?u=yourpage';
  const fanCount = facebookPage?.fan_count ? `${Math.round(facebookPage.fan_count / 1000)}k` : '10k';

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 text-gray-900">
      <div className="flex items-start gap-3">
        <img 
          className="w-12 h-12 rounded-full" 
          src={pagePicture} 
          alt={pageName}
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <p className="font-bold">{pageName}</p>
            <p className="text-gray-500">• 2nd</p>
          </div>
          <p className="text-gray-500 text-sm">{pageName} • {fanCount} followers</p>
          <div className="mt-3">
            {editable ? (
              <div 
                contentEditable
                onInput={(e) => {
                  const target = e.target as HTMLElement;
                  onTextChange?.(target.innerText);
                }}
                className="text-gray-800 text-base p-2 rounded-md min-h-[10rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
                dangerouslySetInnerHTML={{ __html: text }}
              ></div>
            ) : (
              <div className="text-gray-800 text-base p-2 rounded-md min-h-[10rem]">
                {text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstagramTemplate = ({ 
  text, 
  facebookPage,
  editable = false, 
  onTextChange 
}: { 
  text: string; 
  facebookPage?: any;
  editable?: boolean; 
  onTextChange?: (text: string) => void;
}) => {
  // Use Facebook page details if available, otherwise use defaults
  const pageName = facebookPage?.name || 'Your Page';
  const pageUsername = facebookPage?.username || 'yourpage';
  const pagePicture = facebookPage?.picture?.data?.url || 'https://i.pravatar.cc/48?u=yourpage';

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img 
            className="w-8 h-8 rounded-full" 
            src={pagePicture} 
            alt={pageName}
          />
          <span className="font-bold">{pageUsername}</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
          <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
        </div>
      </div>
      
      <div className="flex justify-center my-4">
        <div className="bg-white bg-opacity-20 border-2 border-dashed border-white border-opacity-30 rounded-xl w-64 h-64 flex items-center justify-center">
          <span className="text-white text-opacity-70">Image Preview</span>
        </div>
      </div>
      
      <div className="mt-4">
        {editable ? (
          <div 
            contentEditable
            onInput={(e) => {
              const target = e.target as HTMLElement;
              onTextChange?.(target.innerText);
            }}
            className="text-white text-base p-2 rounded-md min-h-[6rem] focus:outline-none focus:ring-2 focus:ring-white"
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
        ) : (
          <div className="text-white text-base p-2 rounded-md min-h-[6rem]">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export const FacebookTemplate = ({ 
  text, 
  facebookPage,
  editable = false, 
  onTextChange,
  customImage,
  onImageUpload
}: { 
  text: string; 
  facebookPage?: any;
  editable?: boolean; 
  onTextChange?: (text: string) => void;
  customImage?: string | null;
  onImageUpload?: (file: File | null) => void;
}) => {
  // Only use Facebook page details if they are actually available
  const hasValidUsername = !!(facebookPage?.username);
  const hasValidFanCount = !!(facebookPage?.fan_count);
  
  const pageName = facebookPage?.name || 'Your Page';
  const pageUsername = facebookPage?.username || '';
  const pagePicture = facebookPage?.picture?.data?.url || 'https://i.pravatar.cc/40?u=yourpage';
  const fanCount = facebookPage?.fan_count || '';
  const pageCategory = facebookPage?.category || '';
  
  // Format fan count for display (e.g., 1000 -> 1K, 1000000 -> 1M) only if valid
  const formattedFanCount = hasValidFanCount ? (() => {
    const count = parseInt(fanCount);
    if (isNaN(count)) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  })() : '';

  const handleDrag = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload?.(e.dataTransfer.files[0]);
    }
  };

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload?.(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 text-gray-900">
      {/* Facebook Post Header with more details */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <img 
          className="w-10 h-10 rounded-full" 
          src={pagePicture} 
          alt={pageName}
        />
        <div>
          <p className="font-bold">{pageName}</p>
          <div className="flex items-center gap-2">
            {hasValidUsername && (
              <p className="text-gray-500 text-sm">@{pageUsername}</p>
            )}
            {hasValidUsername && pageCategory && (
              <span className="text-gray-300">·</span>
            )}
            {pageCategory && (
              <p className="text-gray-500 text-sm">{pageCategory}</p>
            )}
          </div>
          <p className="text-gray-500 text-xs">Just now</p>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-4">
        {editable ? (
          <div 
            contentEditable
            onInput={(e) => {
              const target = e.target as HTMLElement;
              onTextChange?.(target.innerText);
            }}
            className="text-gray-800 text-base p-2 rounded-md min-h-[6rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
        ) : (
          <div className="text-gray-800 text-base p-2 rounded-md min-h-[6rem]">
            {text}
          </div>
        )}
      </div>
      
      {/* Image Upload Area or Preview */}
      {customImage ? (
        <div className="relative">
          <img 
            src={customImage} 
            alt="Post" 
            className="w-full object-cover"
          />
          {editable && (
            <button
              onClick={() => onImageUpload?.(null)} // Clear image
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>
      ) : editable ? (
        <div
          className={`mx-4 mb-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="font-medium">Drag & drop an image or click to upload</p>
            <p className="text-sm mt-1">Supports JPG, PNG, GIF</p>
          </div>
        </div>
      ) : (
        <div className="mx-4 mb-4 bg-gray-100 rounded-lg p-24 flex items-center justify-center border border-gray-200">
          <span className="text-gray-500">Image Preview</span>
        </div>
      )}
      
      {/* Facebook Post Footer */}
      <div className="px-4 py-2 border-t border-gray-200">
        {hasValidFanCount ? (
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{formattedFanCount} likes</span>
            <span>{Math.round(parseInt(fanCount) / 20).toLocaleString()} comments · {Math.round(parseInt(fanCount) / 50).toLocaleString()} shares</span>
          </div>
        ) : (
          <div className="flex justify-between text-gray-500 text-sm">
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
        )}
        <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
          <div className="flex gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              <span>👍</span> Like
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              <span>💬</span> Comment
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              <span>🔗</span> Share
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};