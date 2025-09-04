// supabase/functions/ayrshare-send-post/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface SendPostPayload {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { post, platforms, mediaUrls }: SendPostPayload = await req.json();

  const ayrshareApiKey = Deno.env.get('AYRSHARE_API_KEY');

  if (!ayrshareApiKey) {
    return new Response(JSON.stringify({ error: 'AYRSHARE_API_KEY not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ayrshareApiKey}`,
      },
      body: JSON.stringify({
        post,
        platforms,
        media_urls: mediaUrls, // Ayrshare uses media_urls
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Ayrshare API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to send post via Ayrshare' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending post to Ayrshare:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
