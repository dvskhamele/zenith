import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_PAID_KEYS || '';

if (!API_KEY) {
  throw new Error('GEMINI_PAID_KEYS environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateContent(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
