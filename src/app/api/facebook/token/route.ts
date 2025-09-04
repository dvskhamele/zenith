import { facebookService } from '@/services/facebookService';

export async function GET() {
  try {
    // Get Facebook access token using the service
    const accessToken = await facebookService.getAccessToken();
    
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No Facebook access token found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate the token
    const isValid = await facebookService.validateToken(accessToken);
    
    console.log('Facebook access token retrieved and validated:', { 
      hasToken: !!accessToken, 
      isValid 
    });
    
    return new Response(JSON.stringify({ 
      access_token: accessToken,
      valid: isValid
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error retrieving Facebook token:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}