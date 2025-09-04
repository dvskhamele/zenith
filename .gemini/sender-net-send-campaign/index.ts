// supabase/functions/sender-net-send-campaign/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface SendCampaignPayload {
  listId: number;
  subject: string;
  htmlContent: string;
  fromEmail: string;
  fromName: string;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { listId, subject, htmlContent, fromEmail, fromName }: SendCampaignPayload = await req.json();

  const senderNetId = Deno.env.get('SENDER_NET_ID'); // Note: API key name from tools.yml

  if (!senderNetId) {
    return new Response(JSON.stringify({ error: 'SENDER_NET_ID not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.sender.net/v2/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderNetId}`,
      },
      body: JSON.stringify({
        list_id: listId,
        subject,
        html_content: htmlContent,
        from_email: fromEmail,
        from_name: fromName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Sender.net API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to send campaign via Sender.net' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending campaign to Sender.net:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
