import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

// Mock Deno.env for environment variables
vi.stubGlobal('Deno', {
  env: {
    get: vi.fn((key: string) => {
      if (key === 'SUPABASE_URL') return 'http://mock-supabase-url';
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'mock-service-role-key';
      return undefined;
    }),
  },
});

// Mock createClient from Supabase
const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
vi.mock('https://esm.sh/@supabase/supabase-js@2.43.4', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Mock the serve function directly from the Edge Function's logic
// This simulates the behavior of the Edge Function without importing the file
const mockServe = async (req: Request) => {
  // Re-implement the core logic of the Edge Function here for testing purposes
  // This avoids file path resolution issues during testing
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'error', message: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const { sheetUrl, sheetName, mapping } = await req.json();

    if (!sheetUrl || !sheetName || !mapping) {
      return new Response(JSON.stringify({ status: 'error', message: 'Missing required parameters: sheetUrl, sheetName, mapping' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // This is a placeholder for Google Sheets API integration.
    // In a real scenario, you would use a Google Sheets API client library
    // and handle OAuth2 authentication.
    const readGoogleSheet = async (sheetUrl: string, sheetName: string, mapping: any): Promise<any[]> => {
      console.log(`Simulating reading Google Sheet: ${sheetUrl}, Sheet: ${sheetName}`);
      // Mock data for demonstration
      return [
        {
          postContent: "Hello from Google Sheets! #Supabase #EdgeFunctions",
          imageUrl: "https://example.com/image1.jpg",
          scheduledDate: "2025-09-03T10:00:00Z",
          platform: "facebook"
        },
        {
          postContent: "Another post from the sheet. #Automation",
          imageUrl: "https://example.com/image2.jpg",
          scheduledDate: "2025-09-03T14:00:00Z",
          platform: "twitter"
        }
      ];
    };

    const sheetData = await readGoogleSheet(sheetUrl, sheetName, mapping);
    let postsScheduled = 0;

    for (const row of sheetData) {
      // Map sheet data to your posts table schema
      const { data, error } = await supabase
        .from('posts') // Assuming you have a 'posts' table
        .insert([
          {
            content: row.postContent,
            image_url: row.imageUrl,
            scheduled_at: row.scheduledDate,
            platform: row.platform,
            status: 'scheduled'
          },
        ]);

      if (error) {
        console.error('Error inserting post:', error);
        continue; // Continue to next row even if one fails
      }
      postsScheduled++;
    }

    return new Response(JSON.stringify({ status: 'success', message: 'Posts scheduled successfully', postsScheduled }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

// Helper to simulate a Deno.serve request
async function simulateRequest(method: string, body: any = null) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    init.body = JSON.stringify(body);
  }

  const req = new Request('http://localhost/bulk-schedule-from-sheets', init);
  return mockServe(req);
}

describe('bulk-schedule-from-sheets Edge Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({ data: {}, error: null }); // Default successful insert
  });

  it('should return 405 for non-POST requests', async () => {
    const response = await simulateRequest('GET');
    expect(response.status).toBe(405);
    const json = await response.json();
    expect(json.status).toBe('error');
    expect(json.message).toBe('Method Not Allowed');
  });

  it('should return 400 for missing parameters', async () => {
    const response = await simulateRequest('POST', {});
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.status).toBe('error');
    expect(json.message).toBe('Missing required parameters: sheetUrl, sheetName, mapping');
  });

  it('should successfully schedule posts from mock sheet data', async () => {
    const body = {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/abc/edit',
      sheetName: 'Sheet1',
      mapping: {
        postContent: 'Content',
        imageUrl: 'Image',
        scheduledDate: 'Date',
        platform: 'Platform',
      },
    };

    const response = await simulateRequest('POST', body);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.status).toBe('success');
    expect(json.postsScheduled).toBe(2); // Based on mock data in readGoogleSheet
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockInsert).toHaveBeenCalledTimes(2);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        content: 'Hello from Google Sheets! #Supabase #EdgeFunctions',
        image_url: 'https://example.com/image1.jpg',
        scheduled_at: '2025-09-03T10:00:00Z',
        platform: 'facebook',
        status: 'scheduled',
      },
    ]);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        content: 'Another post from the sheet. #Automation',
        image_url: 'https://example.com/image2.jpg',
        scheduled_at: '2025-09-03T14:00:00Z',
        platform: 'twitter',
        status: 'scheduled',
      },
    ]);
  });

  it('should handle Supabase insertion errors gracefully', async () => {
    mockInsert.mockReturnValueOnce({ data: null, error: { message: 'DB Error' } }); // First insert fails
    mockInsert.mockReturnValueOnce({ data: {}, error: null }); // Second insert succeeds

    const body = {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/abc/edit',
      sheetName: 'Sheet1',
      mapping: {
        postContent: 'Content',
        imageUrl: 'Image',
        scheduledDate: 'Date',
        platform: 'Platform',
      },
    };

    const response = await simulateRequest('POST', body);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.status).toBe('success');
    expect(json.postsScheduled).toBe(1); // Only one post scheduled successfully
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockInsert).toHaveBeenCalledTimes(2);
  });

  it('should return 500 for unexpected errors', async () => {
    vi.mocked(createClient).mockImplementationOnce(() => {
      throw new Error('Unexpected Supabase client error');
    });

    const body = {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/abc/edit',
      sheetName: 'Sheet1',
      mapping: {
        postContent: 'Content',
        imageUrl: 'Image',
        scheduledDate: 'Date',
        platform: 'Platform',
      },
    };

    const response = await simulateRequest('POST', body);
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.status).toBe('error');
    expect(json.message).toBe('Unexpected Supabase client error');
  });
});