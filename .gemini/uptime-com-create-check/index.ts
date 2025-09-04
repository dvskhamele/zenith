//supabase/functions/uptime-com-create-check/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface CreateCheckPayload {
  url: string;
  checkType: 'http' | 'ping' | 'port';
  interval: number; // in minutes
  name?: string;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { url, checkType, interval, name }: CreateCheckPayload = await req.json();

  const uptimeId = Deno.env.get('UPTIME_ID'); // Note: API key name from tools.yml

  if (!uptimeId) {
    return new Response(JSON.stringify({ error: 'UPTIME_ID not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.uptime.com/api/v2/checks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${uptimeId}` // Uptime.com uses Token authentication
      },
      body: JSON.stringify({
        url,
        check_type: checkType,
        interval,
        name: name || `Monitor for ${url}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Uptime.com API Error:', data);
      return new Response(JSON.stringify({ error: data.detail || 'Failed to create check via Uptime.com' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating check with Uptime.com:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
