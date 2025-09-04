import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServerClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
    }

    // Mock data for testing
    const mockScheduleSlots = [
      {
        id: "123e4567-e89b-12d3-a456-426614174002",
        workspace_id: workspaceId,
        day_of_week: 1, // Monday
        time_of_day: "09:00:00",
        category: "Content",
        color: "bg-blue-500",
        created_at: new Date().toISOString()
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174003",
        workspace_id: workspaceId,
        day_of_week: 2, // Tuesday
        time_of_day: "14:00:00",
        category: "Promotion",
        color: "bg-green-500",
        created_at: new Date().toISOString()
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174004",
        workspace_id: workspaceId,
        day_of_week: 3, // Wednesday
        time_of_day: "10:00:00",
        category: "Engagement",
        color: "bg-purple-500",
        created_at: new Date().toISOString()
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174005",
        workspace_id: workspaceId,
        day_of_week: 4, // Thursday
        time_of_day: "16:00:00",
        category: "Content",
        color: "bg-blue-500",
        created_at: new Date().toISOString()
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174006",
        workspace_id: workspaceId,
        day_of_week: 5, // Friday
        time_of_day: "11:00:00",
        category: "Community",
        color: "bg-yellow-500",
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockScheduleSlots)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for testing
    const mockSlot = {
      id: "123e4567-e89b-12d3-a456-426614174007",
      workspace_id: body.workspaceId,
      day_of_week: body.dayOfWeek,
      time_of_day: body.timeOfDay,
      category: body.category,
      color: body.color,
      created_at: new Date().toISOString()
    }

    return NextResponse.json(mockSlot)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for testing
    const mockSlot = {
      id: body.id,
      workspace_id: body.workspaceId,
      day_of_week: body.dayOfWeek,
      time_of_day: body.timeOfDay,
      category: body.category,
      color: body.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(mockSlot)
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

    return NextResponse.json({ message: 'Schedule slot deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}