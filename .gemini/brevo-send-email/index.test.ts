// supabase/functions/brevo-send-email/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'BREVEO_API') {
    return 'test_brevo_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://api.brevo.com/v3/smtp/email')) {
    const body = JSON.parse(init?.body?.toString() || '{}');
    if (body.sender && body.to && body.subject && init?.headers?.['api-key'] === 'test_brevo_api_key') {
      return new Response(JSON.stringify({ messageId: '12345' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid request' }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('brevo-send-email function', async (t) => {
  await t.step('should send an email successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        sender: { email: 'sender@example.com', name: 'Sender Name' },
        to: [{ email: 'recipient@example.com', name: 'Recipient Name' }],
        subject: 'Test Subject',
        htmlContent: '<h1>Hello World!</h1>',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.messageId, '12345');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if BREVEO_API is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'BREVEO_API') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        sender: { email: 'sender@example.com' },
        to: [{ email: 'recipient@example.com' }],
        subject: 'Test',
        htmlContent: 'Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'BREVEO_API not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Brevo API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://api.brevo.com/v3/smtp/email')) {
        return new Response(JSON.stringify({ message: 'Brevo internal error' }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        sender: { email: 'sender@example.com' },
        to: [{ email: 'recipient@example.com' }],
        subject: 'Error Test',
        htmlContent: 'Error Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Brevo internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
