import { facebookService } from '@/services/facebookService';

export async function POST(request: Request) {
  try {
    console.log('Facebook upload image endpoint called');
    
    // Get form data
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const caption = formData.get('caption') as string || '';
    const pageId = formData.get('pageId') as string || null;
    const token = formData.get('token') as string || null;
    
    console.log('Upload image request data:', { 
      hasImage: !!image, 
      caption: caption?.substring(0, 50) + '...',
      pageId, 
      hasToken: !!token 
    });
    
    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Convert image to base64 string
    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    
    console.log('Converted image to base64, length:', base64Image.length);
    
    // Upload to Facebook using the service
    const result = await facebookService.uploadImage(base64Image, caption, pageId, token);
    
    console.log('Facebook image upload successful:', result);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading image to Facebook:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to upload image to Facebook',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}