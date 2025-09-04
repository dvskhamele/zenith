import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // In a real application, you would call the generate-post API internally
    // For now, we'll simulate the call or provide a placeholder.
    // You might use `fetch` to call your own API route, but be careful with serverless functions
    // calling other serverless functions in the same deployment.

    // Example of calling the generate-post API internally (adjust URL as needed)
    const theme = "social media marketing"; // Default theme for idea generation

    const generateIdeasResponse = await fetch(`${request.nextUrl.origin}/api/generate-content-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });

    if (!generateIdeasResponse.ok) {
      const errorData = await generateIdeasResponse.json();
      console.error('Error from generate-content-ideas API:', errorData);
      return NextResponse.json({ error: 'Failed to generate content ideas' }, { status: 500 });
    }

    const { ideas } = await generateIdeasResponse.json();

    if (!ideas || ideas.length === 0) {
      return NextResponse.json({ error: 'No content ideas generated' }, { status: 500 });
    }

    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

    const generatePostResponse = await fetch(`${request.nextUrl.origin}/api/generate-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: randomIdea }),
    });

    if (!generatePostResponse.ok) {
      const errorData = await generatePostResponse.json();
      console.error('Error from generate-post API:', errorData);
      return NextResponse.json({ error: 'Failed to generate post' }, { status: 500 });
    }

    const responseData = await generatePostResponse.json();
    return NextResponse.json({ message: 'Scheduled post generation triggered successfully', details: responseData }, { status: 200 });
  } catch (error) {
    console.error('Error in scheduled post generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
