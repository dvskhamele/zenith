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
      .from('content_categories')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('name')

    if (error) {
      console.error('Error fetching content categories:', error)
      return NextResponse.json({ error: 'Failed to fetch content categories' }, { status: 500 })
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
      .from('content_categories')
      .insert({
        workspace_id: body.workspaceId,
        name: body.name,
        description: body.description,
        is_evergreen: body.isEvergreen || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating content category:', error)
      return NextResponse.json({ error: 'Failed to create content category' }, { status: 500 })
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
      .from('content_categories')
      .update({
        name: body.name,
        description: body.description,
        is_evergreen: body.isEvergreen
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating content category:', error)
      return NextResponse.json({ error: 'Failed to update content category' }, { status: 500 })
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
      .from('content_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting content category:', error)
      return NextResponse.json({ error: 'Failed to delete content category' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Content category deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}