//supabase/functions/scraping-bee-scrape-url/index.test.ts

import { assert, assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { superoak } from 'https://deno.land/x/superoak@4.7.0/mod.ts';

// Mock Deno.env.get for testing environment variables
const originalDenoEnvGet = Deno.env.get;
Deno.env.get = (key: string) => {
  if (key === 'SCRAPING_BEE_API') {
    return 'test_scraping_bee_api_key';
  }
  return originalDenoEnvGet(key);
};

// Mock fetch API
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.includes('https://app.scrapingbee.com/api/v1/')) {
    const url = new URL(input);
    const apiKey = url.searchParams.get('api_key');
    const targetUrl = url.searchParams.get('url');

    if (apiKey === 'test_scraping_bee_api_key' && targetUrl === 'https://example.com') {
      return new Response('<html><body><h1>Scraped Content</h1></body></html>', { status: 200 });
    } else if (apiKey === 'test_scraping_bee_api_key' && targetUrl === 'https://error.com') {
      return new Response('Scraping Bee Error', { status: 500 });
    } else {
      return new Response('Invalid request', { status: 400 });
    }
  }
  return originalFetch(input, init);
};

Deno.test('scraping-bee-scrape-url function', async (t) => {
  await t.step('should scrape a URL successfully', async () => {
    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://example.com',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 200);
    assertEquals(response.body.success, true);
    assertEquals(response.body.data, '<html><body><h1>Scraped Content</h1></body></html>');
  });

  await t.step('should return 405 for non-POST requests', async () => {
    const request = await superoak(serve);
    const response = await request.get('/');

    assertEquals(response.status, 405);
    assertEquals(response.body.error, 'Method Not Allowed');
  });

  await t.step('should return 500 if SCRAPING_BEE_API is not set', async () => {
    // Temporarily unset the API key for this test
    Deno.env.get = (key: string) => {
      if (key === 'SCRAPING_BEE_API') {
        return undefined;
      }
      return originalDenoEnvGet(key);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://test.com',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'SCRAPING_BEE_API not set');

    // Restore original Deno.env.get
    Deno.env.get = originalDenoEnvGet;
  });

  await t.step('should handle Scraping Bee API errors', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.includes('https://app.scrapingbee.com/api/v1/')) {
        const url = new URL(input);
        const targetUrl = url.searchParams.get('url');
        if (targetUrl === 'https://error.com') {
          return new Response('Scraping Bee internal error', { status: 500 });
        }
      }
      return originalFetch(input, init);
    };

    const request = await superoak(serve);
    const response = await request.post('/')
      .send({
        url: 'https://error.com',
      })
      .set('Content-Type', 'application/json');

    assertEquals(response.status, 500);
    assertEquals(response.body.error, 'Scraping Bee internal error');

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });
});
