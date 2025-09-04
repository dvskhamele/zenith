import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient as createSanityClient } from '@sanity/client';
import { supabase } from '@/lib/supabaseServerClient';

const resend = new Resend(process.env.RESEND_API_KEY);

const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-08-01',
  useCdn: true,
  token: process.env.SANITY_API, // Read-only token is fine for fetching
});

export async function POST(request: Request) {
  try {
    const { _id: postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Fetch the post from Sanity to get its tags
    const post = await sanityClient.fetch(`*[_id == $postId][0]{
      title,
      'slug': slug.current,
      tags,
    }`, { postId });

    if (!post || !post.tags || post.tags.length === 0) {
      return NextResponse.json({ message: 'Post not found or has no tags' }, { status: 200 });
    }

    // Find users who follow any of these tags
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, tag_preferences')
      .not('tag_preferences', 'is', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    const relevantProfiles = profiles.filter(profile => 
      profile.tag_preferences && profile.tag_preferences.some((pref: string) => post.tags.includes(pref))
    );

    if (relevantProfiles.length === 0) {
      return NextResponse.json({ message: 'No followers for these tags' }, { status: 200 });
    }

    // Send email to each relevant user
    const emailPromises = relevantProfiles.map(profile => {
      const emailSubject = `New Post Alert: ${post.title}`; 
      const emailBody = `<h1>New Post Alert!</h1>
        <p>A new post titled "${post.title}" has been published, which matches your interests.</p>
        <p>Read it here: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}">${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}</a></p>
        <p>Happy reading!</p>`;

      return resend.emails.send({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: profile.email,
        subject: emailSubject,
        html: emailBody,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ message: `Notifications sent to ${relevantProfiles.length} users` }, { status: 200 });
  } catch (error) {
    console.error('Error in notify-followers API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
