//supabase/functions/google-gemini-generate-text/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface GenerateTextPayload {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { prompt, temperature, maxOutputTokens }: GenerateTextPayload = await req.json();

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY'); // Note: API key name from tools.yml

  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: temperature || 0.7,
          maxOutputTokens: maxOutputTokens || 1024,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Gemini API Error:', data);
      return new Response(JSON.stringify({ error: data.error?.message || 'Failed to generate text via Google Gemini' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating text with Google Gemini:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
