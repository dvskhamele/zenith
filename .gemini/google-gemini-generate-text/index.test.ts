//supabase/functions/google-gemini-generate-text/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'GEMINI_API_KEY') {
    return 'test_gemini_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    const apiKey = new URL(input).searchParams.get('key');

    if (apiKey === 'test_gemini_api_key' && body.contents?.[0]?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Generated text response.' }] } }] }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: { message: 'Invalid request' } }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('google-gemini-generate-text function', async (t) => {
  await t.step('should generate text successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        prompt: 'Write a short story about a cat.',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.candidates[0].content.parts[0].text, 'Generated text response.' );
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if GEMINI_API_KEY is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'GEMINI_API_KEY') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        prompt: 'Test prompt',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'GEMINI_API_KEY not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Google Gemini API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent')) {
        return new Response(JSON.stringify({ error: { message: 'Gemini internal error' } }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        prompt: 'Error prompt',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Gemini internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
