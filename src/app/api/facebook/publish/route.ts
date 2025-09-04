import { facebookService } from '@/services/facebookService';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { content, pageId, token } = await request.json();
    
    console.log('Facebook publish endpoint called with:', { content: content?.substring(0, 50) + '...', pageId, hasToken: !!token });
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Publish to Facebook using the service, passing the token and pageId if provided
    const result = await facebookService.publishPost(content, pageId, token);
    
    console.log('Facebook publish successful:', result);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error publishing to Facebook:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to publish to Facebook',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}