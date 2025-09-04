//supabase/functions/sanity-create-document/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface CreateDocumentPayload {
  _type: string;
  [key: string]: any; // Allow any other properties for the document
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  const document: CreateDocumentPayload = await req.json();

  const sanityId = Deno.env.get('SANITY_ID'); // Note: API key name from tools.yml
  // Sanity API requires project ID and dataset, typically part of the client setup
  // For simplicity in this simulation, we'll assume a default project ID and dataset
  const sanityProjectId = 'your_sanity_project_id'; // Placeholder
  const sanityDataset = 'production'; // Placeholder

  if (!sanityId) {
    return new Response(JSON.stringify({ error: 'SANITY_ID not set' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const response = await fetch(`https://${sanityProjectId}.api.sanity.io/v1/data/mutate/${sanityDataset}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sanityId}`
      },
      body: JSON.stringify({
        mutations: [
          {
            create: document,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Sanity API Error:', data);
      return new Response(JSON.stringify({ error: data.error?.description || 'Failed to create document via Sanity' }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating document in Sanity:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
