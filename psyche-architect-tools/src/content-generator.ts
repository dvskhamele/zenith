import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import GhostContentAPI from '@try-ghost/content-api'; // For Ghost Content API

// Supabase connection details
const SUPABASE_URL = 'http://localhost:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzY1NDQ0NCwiZXhwIjoxOTMzMDE0NDQ0fQ.0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gemini API Configuration (from project.config)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'; // Placeholder, will be loaded from env
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Ghost Content API Configuration
// In a real scenario, you'd get these from your Ghost Admin settings
const GHOST_API_URL = 'http://localhost:2368'; // Ghost CMS port from docker-compose.yml
const GHOST_CONTENT_API_KEY = 'YOUR_GHOST_CONTENT_API_KEY'; // Placeholder

const ghost = new GhostContentAPI({
  url: GHOST_API_URL,
  key: GHOST_CONTENT_API_KEY,
  version: 'v5.0' // Use the appropriate Ghost API version
});

async function generateAndPublishContent() {
  console.log('Starting content generation and publishing...');

  // Fetch pending keywords from Supabase
  const { data: pendingKeywords, error: fetchError } = await supabase
    .from('keyword_patterns')
    .select('*')
    .eq('status', 'Pending')
    .limit(50); // Process a batch of 50 as per directive

  if (fetchError) {
    console.error('Error fetching pending keywords:', fetchError.message);
    return;
  }

  if (!pendingKeywords || pendingKeywords.length === 0) {
    console.log('No pending keyword patterns found.');
    return;
  }

  for (const keywordData of pendingKeywords) {
    const keywordId = keywordData.id;
    const pattern = keywordData.pattern;

    console.log(`Processing keyword: "${pattern}" (ID: ${keywordId})`);

    const prompt = `
    Write a comprehensive, SEO-optimized article about "${pattern}".
    The article should be at least 800 words long and include:
    1. An engaging title.
    2. An introduction that hooks the reader.
    3. Several subheadings (H2, H3) to break down the content.
    4. Detailed explanations and examples related to the keyword.
    5. A conclusion that summarizes key takeaways and provides a call to action.
    6. Naturally integrate related keywords and phrases.
    7. Ensure the tone is informative and authoritative.
    `;

    let articleContent: string | null = null;
    let articleTitle: string = `Article about ${pattern}`; // Default title

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      articleContent = response.text();

      // Attempt to extract a title from the generated content
      const firstLine = articleContent.split('\n')[0];
      if (firstLine && firstLine.length < 100) { // Simple heuristic for a title
        articleTitle = firstLine.replace(/#/g, '').trim();
      }

      console.log(`Article generated for "${pattern}". Content length: ${articleContent.length} characters.`);

      // Publish to Ghost
      const publishedPost = await ghost.posts.add({
        title: articleTitle,
        html: articleContent, // Or markdown: articleContent
        status: 'published'
      });

      const publishedUrl = publishedPost.url;

      // Update status and URL in Supabase
      const { error: updateError } = await supabase
        .from('keyword_patterns')
        .update({ status: 'Published', published_url: publishedUrl })
        .eq('id', keywordId);

      if (updateError) {
        console.error(`Error updating status for keyword ID ${keywordId}:`, updateError.message);
      } else {
        console.log(`Article published and status updated for "${pattern}". URL: ${publishedUrl}`);
      }

    } catch (llmError: any) {
      console.error(`Error generating or publishing content for "${pattern}":`, llmError.message);
      // Optionally update status to 'Failed' or similar in Supabase
    }
  }
}

generateAndPublishContent();
