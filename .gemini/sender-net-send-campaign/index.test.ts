// supabase/functions/sender-net-send-campaign/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'SENDER_NET_ID') {
    return 'test_sender_net_id';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://api.sender.net/v2/campaigns')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.list_id && body.subject && init?.headers?.['Authorization'] === 'Bearer test_sender_net_id') {
      return new Response(JSON.stringify({ campaignId: '67890' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('sender-net-send-campaign function', async (t) => {
  await t.step('should send a campaign successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        listId: 123,
        subject: 'Test Campaign',
        htmlContent: '<h1>Hello Campaign!</h1>',
        fromEmail: 'campaign@example.com',
        fromName: 'Campaign Sender',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.campaignId, '67890');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if SENDER_NET_ID is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'SENDER_NET_ID') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        listId: 123,
        subject: 'Test',
        htmlContent: 'Body',
        fromEmail: 'test@example.com',
        fromName: 'Test',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'SENDER_NET_ID not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Sender.net API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://api.sender.net/v2/campaigns')) {
        return new Response(JSON.stringify({ message: 'Sender.net internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        listId: 123,
        subject: 'Error Test',
        htmlContent: 'Error Body',
        fromEmail: 'error@example.com',
        fromName: 'Error',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Sender.net internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
