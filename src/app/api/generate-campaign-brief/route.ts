import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { campaignName, objective, targetAudience, incentives } = await request.json();

    if (!campaignName || !objective || !targetAudience || !incentives) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const prompt = `Generate a detailed campaign brief for a UGC campaign. 
Campaign Name: ${campaignName}
Objective: ${objective}
Target Audience: ${targetAudience}
Incentives: ${incentives}

Include sections for: 
- Campaign Overview
- Goals
- Target Audience
- Key Message/Call to Action
- Incentives for Participation
- Promotion Channels
- Tracking & Measurement
- Timeline (suggested)
- Hashtag (suggested, e.g., #ZenithWorkflow)

Make it professional and engaging.`;

    const generatedBrief = await generateContent(prompt);

    return NextResponse.json({ brief: generatedBrief }, { status: 200 });
  } catch (error) {
    console.error('Error generating campaign brief:', error);
    return NextResponse.json({ error: 'Failed to generate campaign brief' }, { status: 500 });
  }
}
