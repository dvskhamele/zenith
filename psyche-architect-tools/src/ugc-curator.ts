import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Supabase connection details
const SUPABASE_URL = 'http://localhost:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzY1NDQ0NCwiZXhwIjoxOTMzMDE0NDQ0fQ.0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'; // Placeholder
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function curateUGC() {
  console.log('Starting UGC curation...');

  // Fetch pending UGC submissions
  const { data: pendingSubmissions, error: fetchError } = await supabase
    .from('ugc_submissions')
    .select('*')
    .eq('status', 'Pending');

  if (fetchError) {
    console.error('Error fetching pending UGC submissions:', fetchError.message);
    return;
  }

  if (!pendingSubmissions || pendingSubmissions.length === 0) {
    console.log('No pending UGC submissions found.');
    return;
  }

  for (const submission of pendingSubmissions) {
    const submissionId = submission.id;
    const postContent = submission.post_content;

    console.log(`Curating UGC submission ID: ${submissionId}`);

    const prompt = `
    Analyze the following user-generated content for brand safety and assign a virality score from 0.0 to 1.0.
    Brand safety criteria: No offensive language, hate speech, violence, or inappropriate content.
    Virality score criteria: How likely is this content to be shared widely? Consider originality, emotional appeal, and relevance.

    Content: "${postContent}"

    Provide your analysis in a JSON format with two keys: "brand_safe" (boolean) and "virality_score" (float).
    Example: {{"brand_safe": true, "virality_score": 0.75}}
    `;

    let brandSafe = false;
    let viralityScore = 0.0;
    let newStatus = "Rejected";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const llmOutput = response.text();

      // Attempt to parse JSON from the response
      let analysis;
      try {
        // Gemini might add markdown, try to strip it
        let cleanOutput = llmOutput.trim();
        if (cleanOutput.startsWith("```json") && cleanOutput.endsWith("```")) {
          cleanOutput = cleanOutput.substring(7, cleanOutput.length - 3).trim();
        }
        analysis = JSON.parse(cleanOutput);
        brandSafe = analysis.brand_safe || false;
        viralityScore = analysis.virality_score || 0.0;
      } catch (parseError: any) {
        console.error(`Error parsing LLM response for submission ID ${submissionId}:`, parseError.message);
      }

      if (brandSafe && viralityScore >= 0.5) { // Example threshold for curation
        newStatus = "Curated";
      }

    } catch (llmError: any) {
      console.error(`Error analyzing UGC with LLM for submission ID ${submissionId}:`, llmError.message);
    }

    // Update status in Supabase
    const { error: updateError } = await supabase
      .from('ugc_submissions')
      .update({
        virality_score: viralityScore,
        status: newStatus
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error(`Error updating UGC submission ID ${submissionId}:`, updateError.message);
    } else {
      console.log(`Updated UGC submission ID ${submissionId} to status '${newStatus}' with score ${viralityScore}`);
    }
  }
  console.log('UGC curation complete.');
}

curateUGC();
