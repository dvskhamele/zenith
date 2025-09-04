//supabase/functions/uptime-com-create-check/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'UPTIME_ID') {
    return 'test_uptime_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://api.uptime.com/api/v2/checks/')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.url && body.check_type && init?.headers?.['Authorization'] === 'Token test_uptime_api_key') {
      return new Response(JSON.stringify({ pk: 123, url: body.url, check_type: body.check_type }), { status: 201 }); // Uptime.com returns 201 Created
    } else {
      return new Response(JSON.stringify({ detail: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('uptime-com-create-check function', async (t) => {
  await t.step('should create a check successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://example.com',
        checkType: 'http',
        interval: 5,
        name: 'Example Website Monitor',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.pk, 123);
    assertEquals(response.body.data.url, 'https://example.com');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if UPTIME_ID is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'UPTIME_ID') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://test.com',
        checkType: 'http',
        interval: 1,
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'UPTIME_ID not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Uptime.com API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://api.uptime.com/api/v2/checks/')) {
        return new Response(JSON.stringify({ detail: 'Uptime.com internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://error.com',
        checkType: 'http',
        interval: 1,
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Uptime.com internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
