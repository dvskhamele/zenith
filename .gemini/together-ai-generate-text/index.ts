//supabase/functions/together-ai-generate-text/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface GenerateTextPayload {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { model, prompt, temperature, maxTokens }: GenerateTextPayload = await req.json();

  const togetherAiKey = Deno.env.get('TOGETHERAI_KEY'); // Note: API key name from tools.yml

  if (!togetherAiKey) {
    return new Response(JSON.stringify({ error: 'TOGETHERAI_KEY not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${togetherAiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Together AI API Error:', data);
      return new Response(JSON.stringify({ error: data.error?.message || 'Failed to generate text via Together AI' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating text with Together AI:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
