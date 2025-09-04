// Facebook utility functions

/**
 * Fetch Facebook pages for the authenticated user
 * @param accessToken Facebook access token
 * @returns Array of Facebook pages
 */
export async function fetchFacebookPages(accessToken: string) {
  try {
    console.log('Fetching Facebook pages with access token');
    
    // Make API call to Facebook Graph API to get pages with proper permissions
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}&fields=name,category,id,access_token,picture,is_published`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Facebook API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Facebook pages data:', data);
    
    // Return the pages array
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Facebook pages:', error);
    throw error;
  }
}

/**
 * Save selected Facebook pages to localStorage
 * @param pages Array of selected Facebook pages
 */
export function saveSelectedFacebookPages(pages: any[]) {
  try {
    console.log('Saving selected Facebook pages:', pages);
    localStorage.setItem('selected_facebook_pages', JSON.stringify(pages));
    console.log('Selected Facebook pages saved successfully');
  } catch (error) {
    console.error('Error saving selected Facebook pages:', error);
    throw error;
  }
}

/**
 * Get selected Facebook pages from localStorage
 * @returns Array of selected Facebook pages
 */
export function getSelectedFacebookPages() {
  try {
    const pages = localStorage.getItem('selected_facebook_pages');
    return pages ? JSON.parse(pages) : [];
  } catch (error) {
    console.error('Error getting selected Facebook pages:', error);
    return [];
  }
}

/**
 * Check if Facebook authentication is complete
 * @returns Boolean indicating if Facebook auth is complete
 */
export function isFacebookAuthComplete() {
  return localStorage.getItem('facebook_auth_completed') === 'true';
}

/**
 * Get Facebook access token from localStorage
 * @returns Facebook access token or null
 */
export function getFacebookAccessToken() {
  return localStorage.getItem('facebook_access_token');
}