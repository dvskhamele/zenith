import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@sanity/client';

const resend = new Resend(process.env.RESEND_API_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-08-01',
  useCdn: true,
  token: process.env.SANITY_API, // Read-only token is fine for fetching
});

export async function POST(request: Request) {
  try {
    const { recipientEmail } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    // Fetch latest posts from Sanity (e.g., last 3 posts)
    const posts = await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc) [0...3]{
      title,
      'slug': slug.current,
      publishedAt,
    }`);

    const emailSubject = 'Latest from Zenith Blog!';
    let emailBody = `<h1>Latest from Zenith Blog!</h1><p>Check out our newest articles:</p><ul>`;

    posts.forEach((post: any) => {
      emailBody += `<li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}">${post.title}</a></li>`;
    });
    emailBody += `</ul><p>Stay tuned for more!</p>`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: emailSubject,
      html: emailBody,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Newsletter sent successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
