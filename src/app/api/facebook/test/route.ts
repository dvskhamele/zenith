import { facebookService } from '@/services/facebookService';

export async function GET() {
  try {
    // Test Facebook connection using the service
    const result = await facebookService.testConnection();
    
    if (!result.connected) {
      return new Response(JSON.stringify({ 
        connected: false,
        error: 'Not connected to Facebook'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Facebook connection test successful');
    
    return new Response(JSON.stringify({ 
      connected: true,
      user: result.user,
      pages: result.pages,
      message: 'Successfully connected to Facebook'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error testing Facebook connection:', error);
    return new Response(JSON.stringify({ 
      connected: false,
      error: error.message || 'Failed to test Facebook connection'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}