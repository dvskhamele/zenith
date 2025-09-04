// Utility functions for Facebook page details
export async function fetchFacebookPageDetails(pageId: string, accessToken: string): Promise<any> {
  try {
    // Fetch detailed page information
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?access_token=${accessToken}&fields=name,username,picture,fan_count,category,about,website`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch page details');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Facebook page details:', error);
    throw error;
  }
}

export async function fetchAllFacebookPages(accessToken: string): Promise<any[]> {
  try {
    // Fetch all pages with detailed information
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}&fields=name,username,picture,fan_count,category,about`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch pages');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Facebook pages:', error);
    throw error;
  }
}

export function getFacebookPageFromStorage(pageId: string): any {
  try {
    const pages = JSON.parse(localStorage.getItem('facebook_pages_cache') || '{}');
    return pages[pageId] || null;
  } catch (error) {
    console.error('Error getting Facebook page from storage:', error);
    return null;
  }
}

export function cacheFacebookPage(pageId: string, pageData: any): void {
  try {
    const pages = JSON.parse(localStorage.getItem('facebook_pages_cache') || '{}');
    pages[pageId] = pageData;
    localStorage.setItem('facebook_pages_cache', JSON.stringify(pages));
  } catch (error) {
    console.error('Error caching Facebook page:', error);
  }
}