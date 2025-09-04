import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.14.0';

// Supabase connection details (from environment variables in Edge Function)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'http://localhost:8000';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Use service role key for server-side operations

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Gemini API Configuration
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log('Webhook received payload:', payload);

    // Check if it's an insert or update event for a 'Curated' UGC submission
    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      const newRecord = payload.record;
      if (newRecord && newRecord.status === 'Curated') {
        const postContent = newRecord.post_content;
        const author = newRecord.author;

        console.log(`Processing curated UGC from ${author}: "${postContent}"`);

        // Use LLM to write a "Community Spotlight" post
        const prompt = `
        Write a "Community Spotlight" post based on the following user-generated content.
        The post should be engaging, highlight the user's contribution, and encourage others to participate.
        Keep it concise, suitable for a blog post or social media update.

        User Content: "${postContent}"
        Author: ${author}
        `;

        let spotlightPost: string | null = null;
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          spotlightPost = response.text();
          console.log('Generated Community Spotlight Post:', spotlightPost);

          // Simulate publishing to Medium (or other external platforms)
          console.log('Simulating publishing Community Spotlight to Medium...');
          // In a real scenario, this would involve Medium API calls.
          // For now, we just log the generated post.

        } catch (llmError: any) {
          console.error('Error generating Community Spotlight with LLM:', llmError.message);
        }

        return new Response(JSON.stringify({ message: 'Curated UGC processed', spotlightPost }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ message: 'No relevant UGC event' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in webhook:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
