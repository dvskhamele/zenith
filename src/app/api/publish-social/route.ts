import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-08-01',
  useCdn: true,
  token: process.env.SANITY_API, // Read-only token is fine for fetching
});

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Fetch the post from Sanity
    const post = await sanityClient.fetch(`*[_id == $postId][0]{
      title,
      'slug': slug.current,
      body,
    }`, { postId });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Extract text from block content
    const plainTextBody = post.body
      .filter((block: any) => block._type === 'block' && block.children)
      .map((block: any) => block.children.map((span: any) => span.text).join(''))
      .join('\n\n');

    // Prepare content for social media
    const socialMediaContent = `New Blog Post: ${post.title}\n\n${plainTextBody.substring(0, 200)}...\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`;

    // Publish to social media using Ayrshare
    const ayrshareResponse = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify({
        post: socialMediaContent,
        platforms: ['twitter', 'linkedin'], // You can customize platforms
      }),
    });

    if (!ayrshareResponse.ok) {
      const errorData = await ayrshareResponse.json();
      console.error('Ayrshare API error:', errorData);
      return NextResponse.json({ error: 'Failed to publish to social media' }, { status: 500 });
    }

    const ayrshareData = await ayrshareResponse.json();
    return NextResponse.json({ message: 'Post published to social media successfully', ayrshareData }, { status: 200 });
  } catch (error) {
    console.error('Error publishing to social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}