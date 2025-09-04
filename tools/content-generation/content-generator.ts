import { GoogleGenerativeAI } from '@google/generative-ai';

async function generateContent(subtoolName: string, subtoolDescription: string): Promise<{ title: string; metaDescription: string; bodyCopy: string }> {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate SEO-optimized content for a landing page for a social media management subtool.
  
  Subtool Name: ${subtoolName}
  Subtool Description: ${subtoolDescription}
  
  Provide:
  1. A compelling, SEO-friendly <title> tag (max 60 characters).
  2. A concise, benefit-driven meta description (max 160 characters).
  3. A short, engaging body copy (around 150-200 words) highlighting benefits, pain points addressed, and a call to action. Use clear, persuasive language.
  
  Format the output as a JSON object with keys: "title", "metaDescription", "bodyCopy".`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsedContent = JSON.parse(text);
    return parsedContent;
  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    throw new Error('Failed to generate content.');
  }
}

// Check if the script is being run directly (ES Module equivalent)
// This is a common pattern for ES Modules when you want to run code only when the file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const subtoolName = args[0];
  const subtoolDescription = args[1];

  if (!subtoolName || !subtoolDescription) {
    console.error('Usage: npx ts-node <script_path> \"<Subtool Name>\" \"<Subtool Description>\"');
    process.exit(1);
  }

  generateContent(subtoolName, subtoolDescription)
    .then(content => {
      console.log(JSON.stringify(content, null, 2));
    })
    .catch(error => {
      console.error('Script execution failed:', error.message);
      process.exit(1); // Exit with error code if script fails
    });
}

export { generateContent };