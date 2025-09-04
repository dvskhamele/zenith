import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServerClient';

export async function POST(request: Request) {
  try {
    const { tags } = await request.json();

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ tag_preferences: tags })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating tag preferences:', error);
      return NextResponse.json({ error: 'Failed to update tag preferences' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tag preferences updated successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error in user-tag-preferences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('tag_preferences')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching tag preferences:', error);
      return NextResponse.json({ error: 'Failed to fetch tag preferences' }, { status: 500 });
    }

    return NextResponse.json({ tag_preferences: data?.tag_preferences || [] }, { status: 200 });
  } catch (error) {
    console.error('Error in user-tag-preferences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
