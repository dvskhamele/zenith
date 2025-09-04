//supabase/functions/scraping-bee-scrape-url/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface ScrapePayload {
  url: string;
  params?: Record<string, any>; // Additional Scraping Bee parameters
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const { url, params }: ScrapePayload = await req.json();

  const scrapingBeeApiKey = Deno.env.get('SCRAPING_BEE_API'); // Note: API key name from tools.yml

  if (!scrapingBeeApiKey) {
    return new Response(JSON.stringify({ error: 'SCRAPING_BEE_API not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: scrapingBeeApiKey,
      url: url,
      ...params,
    }).toString();

    const response = await fetch(`https://app.scrapingbee.com/api/v1/?${queryParams}`, {
      method: 'GET', // Scraping Bee API is typically GET
    });

    const textData = await response.text(); // Scraping Bee returns HTML/JSON as text

    if (!response.ok) {
      console.error('Scraping Bee API Error:', textData);
      return new Response(JSON.stringify({ error: textData || 'Failed to scrape URL via Scraping Bee' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data: textData }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error scraping URL with Scraping Bee:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
