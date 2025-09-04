import { facebookService } from '@/services/facebookService';

export async function GET() {
  try {
    console.log('Testing Facebook service from API route...');
    
    // Test if we can import and use the Facebook service
    const service = facebookService;
    console.log('Facebook service instance:', service);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Facebook service is available' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error testing Facebook service:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}