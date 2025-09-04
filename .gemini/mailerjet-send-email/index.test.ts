//supabase/functions/mailerjet-send-email/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'MAILERJET_API') {
    return 'test_mailerjet_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://api.mailjet.com/v3.1/send')) {
    const authHeader = init?.headers?.['Authorization'];
    const expectedAuth = `Basic ${btoa(`:${originalDenoEnvGet('MAILERJET_API')}`)}`;
    const body = JSON.parse(init?.body?.toString() || '{}');

    if (authHeader === expectedAuth && body.Messages?.[0]?.From && body.Messages?.[0]?.To && body.Messages?.[0]?.Subject) {
      return new Response(JSON.stringify({ Messages: [{ Status: 'success', To: body.Messages[0].To }] }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ Messages: [{ Errors: [{ ErrorMessage: 'Invalid request' }] }] }), { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('mailerjet-send-email function', async (t) => {
  await t.step('should send an email successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        to: [{ Email: 'recipient@example.com', Name: 'Recipient Name' }],
        subject: 'Test Subject',
        htmlPart: '<h1>Hello World!</h1>',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data.Messages[0].Status, 'success');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if MAILERJET_API is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'MAILERJET_API') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        fromEmail: 'test@example.com',
        fromName: 'Test',
        to: [{ Email: 'recipient@example.com' }],
        subject: 'Test',
        htmlPart: 'Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'MAILERJET_API not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle MailerJet API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://api.mailjet.com/v3.1/send')) {
        return new Response(JSON.stringify({ Messages: [{ Errors: [{ ErrorMessage: 'MailerJet internal error' }] }] }), { status: 500 });
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        fromEmail: 'error@example.com',
        fromName: 'Error',
        to: [{ Email: 'recipient@example.com' }],
        subject: 'Error Test',
        htmlPart: 'Error Body',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'MailerJet internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
