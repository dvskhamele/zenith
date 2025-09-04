//supabase/functions/betterstack-send-logs/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'LOGTAILBETTERSTACK') {
    return 'test_logtail_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://in.logtail.com/')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.message && init?.headers?.['Authorization'] === 'Bearer test_logtail_api_key') {
      return new Response(null, { status: 202 }); // Logtail returns 202 Accepted
    } else {
      return new Response('Invalid request', { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('betterstack-send-logs function', async (t) => {
  await t.step('should send logs successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        message: 'User logged in',
        level: 'info',
        context: { userId: 'user123' },
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.status, 202);
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if LOGTAILBETTERSTACK is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'LOGTAILBETTERSTACK') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        message: 'Test log',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'LOGTAILBETTERSTACK not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Logtail API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://in.logtail.com/')) {
        return new Response('Logtail internal error', { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        message: 'Error log',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Logtail internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
