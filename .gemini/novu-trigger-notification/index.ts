//supabase/functions/novu-trigger-notification/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface TriggerNotificationPayload {
  name: string; // Event name
  to: { subscriberId: string; email?: string; phone?: string; [key: string]: any }; // Recipient details
  payload?: Record<string, any>; // Data for the template
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { name, to, payload }: TriggerNotificationPayload = await req.json();

  const novuApiKey = Deno.env.get('NOVU_API_KEY'); // Note: API key name from tools.yml

  if (!novuApiKey) {
    return new Response(JSON.stringify({ error: 'NOVU_API_KEY not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.novu.co/v1/events/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${novuApiKey}`
      },
      body: JSON.stringify({
        name,
        to,
        payload,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Novu API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to trigger notification via Novu' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error triggering notification with Novu:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
