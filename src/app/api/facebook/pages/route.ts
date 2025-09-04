import { facebookService } from '@/services/facebookService';

export async function GET() {
  try {
    console.log('Fetching Facebook pages via API endpoint...');
    
    // Get Facebook pages using the service
    const pages = await facebookService.getPages();
    
    console.log(`Successfully retrieved ${pages.length} Facebook pages`);
    
    return new Response(JSON.stringify({ 
      success: true,
      pages: pages,
      count: pages.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in Facebook pages API endpoint:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to fetch Facebook pages'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}