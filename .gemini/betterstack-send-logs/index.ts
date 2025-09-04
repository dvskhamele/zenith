//supabase/functions/betterstack-send-logs/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface LogPayload {
  message: string;
  level?: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  dt?: string; // ISO 8601 timestamp
  context?: Record<string, any>;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { message, level, dt, context }: LogPayload = await req.json();

  const logtailApiKey = Deno.env.get('LOGTAILBETTERSTACK'); // Note: API key name from tools.yml

  if (!logtailApiKey) {
    return new Response(JSON.stringify({ error: 'LOGTAILBETTERSTACK not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://in.logtail.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${logtailApiKey}`
      },
      body: JSON.stringify({
        message,
        level: level || 'info',
        dt: dt || new Date().toISOString(),
        ...context, // Merge context properties directly
      }),
    });

    // Logtail API typically returns 202 Accepted with no body for success
    if (!response.ok && response.status !== 202) {
      const errorData = await response.text(); // Logtail might return plain text error
      console.error('Logtail API Error:', errorData);
      return new Response(JSON.stringify({ error: errorData || 'Failed to send logs to BetterStack' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, status: response.status }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending logs to BetterStack:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
