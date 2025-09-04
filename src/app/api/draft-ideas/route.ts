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
      .from('draft_ideas')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching draft ideas:', error)
      return NextResponse.json({ error: 'Failed to fetch draft ideas' }, { status: 500 })
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
    
    const { data, error } = await supabase
      .from('draft_ideas')
      .insert({
        workspace_id: body.workspaceId,
        type: body.type,
        text: body.text
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating draft idea:', error)
      return NextResponse.json({ error: 'Failed to create draft idea' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('draft_ideas')
      .update({
        type: body.type,
        text: body.text
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating draft idea:', error)
      return NextResponse.json({ error: 'Failed to update draft idea' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('draft_ideas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting draft idea:', error)
      return NextResponse.json({ error: 'Failed to delete draft idea' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Draft idea deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}