//supabase/functions/posthog-capture-event/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'POSTHOG_APIKEY') {
    return 'test_posthog_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://app.posthog.com/capture/')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.api_key === 'test_posthog_api_key' && body.event && body.distinct_id) {
      return new Response(JSON.stringify({ status: 1 }), { status: 200 }); // PostHog returns status 1 for success
    } else {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('posthog-capture-event function', async (t) => {
  await t.step('should capture an event successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        event: 'user_signed_up',
        distinct_id: 'user123',
        properties: {
          plan: 'free',
          source: 'organic',
        },
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.status, 1);
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if POSTHOG_APIKEY is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'POSTHOG_APIKEY') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        event: 'test_event',
        distinct_id: 'test_user',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'POSTHOG_APIKEY not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle PostHog API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://app.posthog.com/capture/')) {
        return new Response(JSON.stringify({ error: 'PostHog internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        event: 'error_event',
        distinct_id: 'error_user',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'PostHog internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
