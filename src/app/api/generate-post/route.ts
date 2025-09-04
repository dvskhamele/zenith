import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-08-01',
  useCdn: false,
  token: process.env.SANITY_API, // Ensure this is a token with write access
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate content using Gemini
    const generatedText = await generateContent(prompt);

    // Extract title and body (simple parsing for now, can be improved)
    const lines = generatedText.split('\n');
    const title = lines[0].replace(/^(Title:|#)\s*/i, '').trim();
    const body = lines.slice(1).join('\n').trim();

    // Generate tags using Gemini
    const tagsPrompt = `Generate 3-5 relevant tags (comma-separated) for the following blog post content:

"""
${generatedText}
"""

Tags:`;
    const generatedTagsText = await generateContent(tagsPrompt);
    const tags = generatedTagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    // Create a slug from the title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-'); // Replace multiple dashes with a single dash

    // Save to Sanity
    const doc = {
      _type: 'post',
      title: title,
      slug: { current: slug },
      body: [{ _type: 'block', children: [{ _type: 'span', text: body }] }], // Simple block content
      publishedAt: new Date().toISOString(),
      tags: tags, // Add generated tags
      // You might want to add a default author or category here
    };

    const createdDoc = await sanityClient.create(doc);

    return NextResponse.json({ message: 'Post generated and saved successfully', postId: createdDoc._id }, { status: 200 });
  } catch (error) {
    console.error('Error generating or saving post:', error);
    return NextResponse.json({ error: 'Failed to generate or save post' }, { status: 500 });
  }
}
