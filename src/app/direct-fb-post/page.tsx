'use client';

import { useState } from 'react';

export default function DirectFacebookPost() {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState('');

  const postToFacebook = async () => {
    if (!content.trim()) {
      setResult('Please enter content');
      return;
    }

    setIsPosting(true);
    setResult('Posting...');

    try {
      // Direct API call to our endpoint
      const response = await fetch('/api/facebook/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult('Posted successfully to Facebook!');
        setContent('');
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }

    setIsPosting(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e293b', color: 'white', minHeight: '100vh' }}>
      <h1>Direct Facebook Post</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        style={{ 
          width: '100%', 
          height: '100px', 
          padding: '10px', 
          backgroundColor: '#334155', 
          color: 'white', 
          border: '1px solid #475569', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}
      />
      <br />
      <button
        onClick={postToFacebook}
        disabled={isPosting}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: isPosting ? 'not-allowed' : 'pointer',
          opacity: isPosting ? 0.7 : 1
        }}
      >
        {isPosting ? 'Posting...' : 'Post to Facebook'}
      </button>
      <br />
      <br />
      {result && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: result.includes('Error') ? '#dc2626' : '#16a34a', 
          borderRadius: '4px' 
        }}>
          {result}
        </div>
      )}
    </div>
  );
}