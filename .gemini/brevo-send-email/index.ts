// supabase/functions/brevo-send-email/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface SendEmailPayload {
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { sender, to, subject, htmlContent, textContent }: SendEmailPayload = await req.json();

  const brevoApiKey = Deno.env.get('BREVEO_API'); // Note: API key name from tools.yml

  if (!brevoApiKey) {
    return new Response(JSON.stringify({ error: 'BREVEO_API not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender,
        to,
        subject,
        htmlContent,
        textContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to send email via Brevo' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email to Brevo:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
