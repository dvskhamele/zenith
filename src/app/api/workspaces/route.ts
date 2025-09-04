import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock data for testing with proper UUIDs
  const mockWorkspaces = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Innovate Corp B2B Tech Startup",
      initials: "IC",
      color: "bg-blue-500",
      created_at: new Date().toISOString()
    }
  ];

  return NextResponse.json(mockWorkspaces);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock response for testing with proper UUID
  const mockWorkspace = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: body.name,
    initials: body.initials || body.name.substring(0, 2).toUpperCase(),
    color: body.color || "bg-blue-500",
    created_at: new Date().toISOString()
  };

  return NextResponse.json(mockWorkspace);
}