// supabase/functions/ayrshare-send-post/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'AYRSHARE_API_KEY') {
    return 'test_ayrshare_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://app.ayrshare.com/api/post')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.post && body.platforms && init?.headers?.['Authorization'] === 'Bearer test_ayrshare_api_key') {
      return new Response(JSON.stringify({ status: 'success', postId: '123' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('ayrshare-send-post function', async (t) => {
  await t.step('should send a social post successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        post: 'Hello from Zenith!',
        platforms: ['twitter', 'linkedin'],
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.status, 'success');
    assertEquals(response.body.data.postId, '123');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if AYRSHARE_API_KEY is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'AYRSHARE_API_KEY') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        post: 'Test post',
        platforms: ['twitter'],
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'AYRSHARE_API_KEY not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Ayrshare API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://app.ayrshare.com/api/post')) {
        return new Response(JSON.stringify({ message: 'Ayrshare internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        post: 'Error post',
        platforms: ['twitter'],
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Ayrshare internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
