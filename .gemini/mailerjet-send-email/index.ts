//supabase/functions/mailerjet-send-email/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface SendEmailPayload {
  fromEmail: string;
  fromName: string;
  to: { Email: string; Name?: string }[];
  subject: string;
  htmlPart?: string;
  textPart?: string;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { fromEmail, fromName, to, subject, htmlPart, textPart }: SendEmailPayload = await req.json();

  const mailerJetApiKey = Deno.env.get('MAILERJET_API'); // Note: API key name from tools.yml

  if (!mailerJetApiKey) {
    return new Response(JSON.stringify({ error: 'MAILERJET_API not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`:${mailerJetApiKey}`)}`, // MailerJet uses Basic Auth with API Key as password
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: to,
            Subject: subject,
            HTMLPart: htmlPart,
            TextPart: textPart,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerJet API Error:', data);
      return new Response(JSON.stringify({ error: data.Messages?.[0]?.Errors?.[0]?.ErrorMessage || 'Failed to send email via MailerJet' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email to MailerJet:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
