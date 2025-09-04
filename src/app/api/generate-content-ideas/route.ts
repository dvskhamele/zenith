import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { theme } = await request.json();

    if (!theme) {
      return NextResponse.json({ error: 'Theme is required' }, { status: 400 });
    }

    const prompt = `Generate 5 unique and engaging blog post ideas about "${theme}". Focus on "how-to" guides and "problem-solution" articles. Provide them as a comma-separated list.`;

    const generatedIdeasText = await generateContent(prompt);

    // Simple parsing: assuming a comma-separated list
    const ideas = generatedIdeasText.split(',').map(idea => idea.trim()).filter(idea => idea.length > 0);

    return NextResponse.json({ ideas }, { status: 200 });
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return NextResponse.json({ error: 'Failed to generate content ideas' }, { status: 500 });
  }
}
