// supabase/functions/resend-send-email/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'RESEND_API_KEY') {
    return 'test_resend_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://api.resend.com/emails')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.from && body.to && body.subject && init?.headers?.['Authorization'] === 'Bearer test_resend_api_key') {
      return new Response(JSON.stringify({ id: 'email_id_123', from: body.from, to: body.to, subject: body.subject }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('resend-send-email function', async (t) => {
  await t.step('should send an email successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        from: 'onboarding@example.com',
        to: 'user@example.com',
        subject: 'Welcome to Zenith!',
        html: '<h1>Welcome!</h1><p>Thanks for joining.</p>',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.id, 'email_id_123');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if RESEND_API_KEY is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'RESEND_API_KEY') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        from: 'test@example.com',
        to: 'user@example.com',
        subject: 'Test',
        text: 'Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'RESEND_API_KEY not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Resend API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://api.resend.com/emails')) {
        return new Response(JSON.stringify({ message: 'Resend internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        from: 'error@example.com',
        to: 'user@example.com',
        subject: 'Error Test',
        text: 'Error Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Resend internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
