'use client';

import React, { useState, useEffect } from 'react';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Simple markdown to HTML converter
    const convertMarkdownToHtml = (markdown: string) => {
      // Convert headers
      let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>');

      // Convert bold and italic
      html = html
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>');

      // Convert lists
      html = html
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/<\/li>\s<li>/gim, '</li><li>');

      // Wrap consecutive <li> elements in <ul>
      html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

      // Convert links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-sky-400 hover:underline">$1</a>');

      // Convert paragraphs
      html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
        return /<(h|ul|ol|li|blockquote|pre|table|dl|figure|div|section|article|aside|nav|header|footer|main)/.test(m) ? m : "<p>" + m + "</p>";
      });

      // Add line breaks
      html = html.replace(/\n/g, '<br />');

      return html;
    };

    setHtmlContent(convertMarkdownToHtml(content));
  }, [content]);

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}