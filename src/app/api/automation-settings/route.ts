import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServerClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching automation settings:', error)
      return NextResponse.json({ error: 'Failed to fetch automation settings' }, { status: 500 })
    }

    // If no settings found, return default settings
    if (!data) {
      return NextResponse.json({
        workspace_id: workspaceId,
        evergreen: true,
        top_performers: false,
        repost_to_story: false
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // First try to update existing settings
    const { data: updateData, error: updateError } = await supabase
      .from('automation_settings')
      .update({
        evergreen: body.evergreen,
        top_performers: body.topPerformers,
        repost_to_story: body.repostToStory
      })
      .eq('workspace_id', body.workspaceId)
      .select()
      .single()

    // If update failed because no row exists, create a new one
    if (updateError && updateError.code === 'PGRST116') {
      const { data: insertData, error: insertError } = await supabase
        .from('automation_settings')
        .insert({
          workspace_id: body.workspaceId,
          evergreen: body.evergreen,
          top_performers: body.topPerformers,
          repost_to_story: body.repostToStory
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating automation settings:', insertError)
        return NextResponse.json({ error: 'Failed to create automation settings' }, { status: 500 })
      }

      return NextResponse.json(insertData)
    }

    if (updateError) {
      console.error('Error updating automation settings:', updateError)
      return NextResponse.json({ error: 'Failed to update automation settings' }, { status: 500 })
    }

    return NextResponse.json(updateData)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}