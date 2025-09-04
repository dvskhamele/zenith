import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServerClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
    }

    // Mock data for testing
    const mockPosts = [
      {
        id: "123e4567-e89b-12d3-a456-426614174008",
        workspace_id: workspaceId,
        schedule_slot_id: "123e4567-e89b-12d3-a456-426614174002",
        content_category_id: null,
        text: "Exciting news! We're launching our new product next week. Stay tuned for more details!",
        media_url: null,
        template: null,
        status: "scheduled",
        scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        published_at: null,
        created_at: new Date().toISOString()
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174009",
        workspace_id: workspaceId,
        schedule_slot_id: "123e4567-e89b-12d3-a456-426614174003",
        content_category_id: null,
        text: "Check out our latest blog post on industry trends. Lots of insights for 2024!",
        media_url: "https://example.com/image.jpg",
        template: null,
        status: "scheduled",
        scheduled_at: new Date(Date.now() + 172800000).toISOString(), // In 2 days
        published_at: null,
        created_at: new Date().toISOString()
      }
    ];

    // Return mock data for now
    return NextResponse.json(mockPosts)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for testing
    const mockPost = {
      id: "123e4567-e89b-12d3-a456-426614174010",
      workspace_id: body.workspaceId,
      schedule_slot_id: body.scheduleSlotId,
      content_category_id: body.contentCategoryId,
      text: body.text,
      media_url: body.mediaUrl,
      template: body.template,
      status: body.status || 'draft',
      scheduled_at: body.scheduledAt,
      published_at: null,
      created_at: new Date().toISOString()
    }

    return NextResponse.json(mockPost)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for testing
    const mockPost = {
      id: body.id,
      workspace_id: body.workspaceId,
      schedule_slot_id: body.scheduleSlotId,
      content_category_id: body.contentCategoryId,
      text: body.text,
      media_url: body.mediaUrl,
      template: body.template,
      status: body.status,
      scheduled_at: body.scheduledAt,
      published_at: body.publishedAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(mockPost)
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

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}