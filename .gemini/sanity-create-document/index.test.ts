//supabase/functions/sanity-create-document/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'SANITY_ID') {
    return 'test_sanity_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://your_sanity_project_id.api.sanity.io/v1/data/mutate/production')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.mutations?.[0]?.create?._type && init?.headers?.['Authorization'] === 'Bearer test_sanity_api_key') {
      return new Response(JSON.stringify({ results: [{ _id: 'doc123', _type: body.mutations[0].create._type }] }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: { description: 'Invalid request' } }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('sanity-create-document function', async (t) => {
  await t.step('should create a document successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        _type: 'post',
        title: 'My New Post',
        slug: { current: 'my-new-post' },
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.results[0]._id, 'doc123');
    assertEquals(response.body.data.results[0]._type, 'post');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if SANITY_ID is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'SANITY_ID') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        _type: 'test',
        title: 'Test',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'SANITY_ID not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Sanity API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://your_sanity_project_id.api.sanity.io/v1/data/mutate/production')) {
        return new Response(JSON.stringify({ error: { description: 'Sanity internal error' } }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        _type: 'error',
        title: 'Error Test',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Sanity internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
