import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { targetUrl, topic } = await request.json();

    if (!targetUrl || !topic) {
      return NextResponse.json({ error: 'targetUrl and topic are required' }, { status: 400 });
    }

    // Use ScrapingBee to get content from the target URL
    // For simplicity, we'll just fetch the content directly here.
    // In a real scenario, you'd use ScrapingBee's API to handle proxies, CAPTCHAs, etc.
    const scrapingBeeApiKey = process.env.SCRAPING_BEE_API;
    if (!scrapingBeeApiKey) {
      return NextResponse.json({ error: 'SCRAPING_BEE_API environment variable is not set.' }, { status: 500 });
    }

    const scrapeResponse = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${scrapingBeeApiKey}&url=${encodeURIComponent(targetUrl)}`);
    
    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      console.error('ScrapingBee error:', errorText);
      return NextResponse.json({ error: 'Failed to scrape target URL' }, { status: scrapeResponse.status });
    }

    const scrapedContent = await scrapeResponse.text();

    // Extract relevant information from scraped content (simplified)
    // In a real application, you'd use a more robust parsing library (e.g., Cheerio)
    const contentSnippet = scrapedContent.substring(0, 2000); // Take first 2000 chars

    const prompt = `Based on the following content from a blog (${targetUrl}):

"""
${contentSnippet}
"""

Generate a personalized guest post pitch for a blog post about "${topic}". The pitch should be concise, highlight why the topic is relevant to their audience, and suggest a unique angle. Also, try to infer a contact person or general contact email if possible from the content.`;

    const generatedPitch = await generateContent(prompt);

    return NextResponse.json({ pitch: generatedPitch }, { status: 200 });
  } catch (error) {
    console.error('Error generating guest post pitch:', error);
    return NextResponse.json({ error: 'Failed to generate guest post pitch' }, { status: 500 });
  }
}
