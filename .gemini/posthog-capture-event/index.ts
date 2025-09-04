//supabase/functions/posthog-capture-event/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface CaptureEventPayload {
  event: string;
  distinct_id: string;
  properties?: Record<string, any>;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { event, distinct_id, properties }: CaptureEventPayload = await req.json();

  const posthogApiKey = Deno.env.get('POSTHOG_APIKEY'); // Note: API key name from tools.yml
  const posthogHost = 'https://app.posthog.com'; // Default PostHog Cloud instance, or local if configured

  if (!posthogApiKey) {
    return new Response(JSON.stringify({ error: 'POSTHOG_APIKEY not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch(`${posthogHost}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: posthogApiKey,
        event,
        distinct_id,
        properties: {
          ...properties,
          $lib: 'supabase-edge-function', // Identify source
        },
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PostHog API Error:', data);
      return new Response(JSON.stringify({ error: data.error || 'Failed to capture event via PostHog' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error capturing event with PostHog:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
