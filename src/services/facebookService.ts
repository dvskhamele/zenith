// Facebook Integration Service
// This service provides a unified interface for all Facebook operations

import { supabase } from '@/lib/supabaseClient';

class FacebookService {
  private baseUrl = 'https://graph.facebook.com/v19.0';

  // Get Facebook access token from session or localStorage with better error handling
  async getAccessToken(overrideToken?: string): Promise<string | null> {
    try {
      console.log('=== GET ACCESS TOKEN START ===');
      
      // If an override token is provided (e.g., from server-side API), use it
      if (overrideToken) {
        console.log('Using override token, length:', overrideToken.length);
        // Validate the token before returning
        const validation = await this.validateToken(overrideToken);
        if (validation.valid) {
          console.log('Override token validated successfully');
          return overrideToken;
        } else {
          console.log('Override token is invalid:', validation.error);
          throw new Error(`Invalid override token: ${validation.error}`);
        }
      }
      
      // Try to get from localStorage first (most reliable for client-side)
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('facebook_access_token');
        if (storedToken) {
          console.log('Token found in localStorage, length:', storedToken.length);
          // Validate token before returning
          const validation = await this.validateToken(storedToken);
          if (validation.valid) {
            console.log('Token validated successfully');
            if (validation.permissions) {
              console.log('Token permissions:', validation.permissions);
            }
            return storedToken;
          } else {
            console.log('Stored token is invalid, removing it:', validation.error);
            localStorage.removeItem('facebook_access_token');
          }
        }
      }
      
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        // Don't throw error, try localStorage fallback
      }
      
      if (!session) {
        console.log('No active Supabase session');
      } else {
        console.log('Supabase session found');
        
        // Get the provider token (Facebook access token)
        const facebookAccessToken = session.provider_token;
        
        if (facebookAccessToken) {
          console.log('Token found in Supabase session, length:', facebookAccessToken.length);
          // Validate the token before returning
          const validation = await this.validateToken(facebookAccessToken);
          if (validation.valid) {
            console.log('Session token validated successfully');
            return facebookAccessToken;
          } else {
            console.log('Session token is invalid:', validation.error);
          }
        }
      }
      
      // Last resort: check localStorage again
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('facebook_access_token');
        if (storedToken) {
          console.log('Emergency fallback: Token found in localStorage, length:', storedToken.length);
          return storedToken;
        }
      }
      
      console.log('No Facebook access token found anywhere');
      return null;
    } catch (error) {
      console.error('Error getting Facebook access token:', error);
      // Try absolute fallback
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('facebook_access_token');
          if (storedToken) {
            console.log('Absolute emergency fallback: Token found in localStorage, length:', storedToken.length);
            return storedToken;
          }
        }
      } catch (fallbackError) {
        console.error('Absolute fallback failed:', fallbackError);
      }
      return null;
    }
  }

  // Validate Facebook access token with detailed information
  async validateToken(token: string): Promise<{valid: boolean; permissions?: string[]; error?: string}> {
    try {
      // First, check basic token validity
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${token}&fields=id,name,email`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          valid: false,
          error: errorData.error?.message || 'Token invalid'
        };
      }
      
      // If basic validation passes, check permissions
      try {
        // Check what permissions the token has
        // Note: For debug_token, we need to use the app access token, but for simplicity,
        // we'll skip this for now and just return valid
        console.log('Token validation passed, skipping detailed permission check for now');
      } catch (debugError) {
        console.log('Could not check token permissions:', debugError);
        // Still return valid since basic validation passed
      }
      
      return {
        valid: true
      };
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return {
        valid: false,
        error: error.message || 'Token validation failed'
      };
    }
  }

  // Get user's Facebook pages with enhanced error handling and fallbacks
  async getPages(): Promise<any[]> {
    try {
      console.log('=== GET PAGES METHOD START ===');
      
      // Try to get token from session first
      let token: string | null = null;
      try {
        token = await this.getAccessToken();
        console.log('Token from getAccessToken():', token ? 'Found' : 'Not found');
      } catch (sessionError) {
        console.log('Session token retrieval failed:', sessionError.message);
      }
      
      // Fallback to direct localStorage access
      if (!token) {
        console.log('Trying direct localStorage access...');
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('facebook_access_token');
          if (storedToken) {
            token = storedToken;
            console.log('Token found directly in localStorage');
          }
        }
      }
      
      if (!token) {
        throw new Error('No Facebook access token available from session or localStorage');
      }
      
      console.log('Using token for pages request');
      
      // Validate token first
      const validation = await this.validateToken(token);
      console.log('Token validity check:', validation);
      
      if (!validation.valid) {
        throw new Error(`Facebook access token is invalid or expired: ${validation.error}`);
      }
      
      // Check if token has required permissions
      if (validation.permissions) {
        const requiredPermissions = ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'];
        const missingPermissions = requiredPermissions.filter(
          perm => !validation.permissions.includes(perm)
        );
        
        if (missingPermissions.length > 0) {
          console.log('Warning: Token missing required permissions:', missingPermissions);
        } else {
          console.log('Token has all required permissions');
        }
      }
      
      // Get user profile to confirm token works
      try {
        const userResponse = await fetch(
          `${this.baseUrl}/me?access_token=${token}&fields=id,name,email`
        );
        
        const userData = await userResponse.json();
        
        if (!userResponse.ok) {
          console.error('User profile API error:', userData);
          throw new Error(userData.error?.message || 'Failed to fetch user profile');
        }
        
        console.log('User profile retrieved:', userData.name);
      } catch (userError) {
        console.error('Error fetching user profile:', userError);
        // Continue anyway as we might still get pages
      }
      
      // Get pages using the token
      console.log('Fetching Facebook pages with token...');
      const response = await fetch(
        `${this.baseUrl}/me/accounts?access_token=${token}&fields=name,id,category,picture,fan_count`
      );
      
      const data = await response.json();
      console.log('Pages API response:', data);
      
      if (!response.ok) {
        console.error('Facebook pages API error:', data);
        throw new Error(data.error?.message || 'Failed to fetch Facebook pages');
      }
      
      // Additional debugging - check if we have an empty data array
      if (data && data.data && Array.isArray(data.data)) {
        console.log('Pages retrieved successfully:', data.data.length);
        if (data.data.length === 0) {
          console.log('Warning: No pages found. This might be due to:');
          console.log('1. User has no Facebook pages');
          console.log('2. Token lacks pages_show_list permission');
          console.log('3. User account is not a business account with page access');
        }
        return data.data;
      } else {
        console.log('Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      throw error;
    }
  }

  // Get user's Facebook profile
  async getProfile(): Promise<any> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('No Facebook access token available');
      }
      
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${token}&fields=id,name,email,picture`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch Facebook profile');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching Facebook profile:', error);
      throw error;
    }
  }

  // Upload image to Facebook
  async uploadImage(base64Image: string, caption: string = '', pageId?: string, overrideToken?: string): Promise<any> {
    try {
      const token = await this.getAccessToken(overrideToken);
      if (!token) {
        throw new Error('No Facebook access token available. Please reconnect your Facebook account.');
      }
      
      let accessTokenToUse = token;
      let url = `${this.baseUrl}/me/photos`;
      
      // If a page ID is provided, get the page access token
      if (pageId) {
        console.log('Fetching page access token for page ID:', pageId);
        const pageTokenResponse = await fetch(
          `${this.baseUrl}/${pageId}?fields=access_token&access_token=${token}`
        );
        
        const pageTokenData = await pageTokenResponse.json();
        
        if (!pageTokenResponse.ok) {
          console.error('Error fetching page access token:', pageTokenData);
          const errorMessage = pageTokenData.error?.message || 'Failed to get page access token';
          throw new Error(`Failed to get page access token: ${errorMessage}`);
        }
        
        accessTokenToUse = pageTokenData.access_token;
        url = `${this.baseUrl}/${pageId}/photos`;
        console.log('Using page access token for image upload');
      } else {
        console.log('Using user access token for image upload to personal feed');
      }
      
      // For Facebook photo upload, we need to send as form data
      // First, convert base64 to buffer for server-side usage
      const imageBuffer = Buffer.from(base64Image, 'base64');
      
      const formData = new FormData();
      formData.append('source', new Blob([imageBuffer], { type: 'image/png' }));
      if (caption) {
        formData.append('caption', caption);
      }
      formData.append('access_token', accessTokenToUse);
      
      console.log('Uploading image to Facebook:', { url, hasCaption: !!caption });
      
      // Upload to Facebook
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Failed to upload image to Facebook';
        if (responseData && responseData.error) {
          errorMessage = responseData.error.message || responseData.error.type || errorMessage;
          // Log additional error details for debugging
          console.error('Facebook API error details:', {
            type: responseData.error.type,
            code: responseData.error.code,
            fbtrace_id: responseData.error.fbtrace_id,
            message: responseData.error.message
          });
        }
        
        throw new Error(`Facebook API error: ${errorMessage}`);
      }
      
      console.log('Image uploaded to Facebook successfully:', responseData);
      
      return {
        success: true,
        data: responseData,
        facebook_post_id: responseData.post_id
      };
    } catch (error) {
      console.error('Error uploading image to Facebook:', error);
      // Re-throw with more user-friendly message
      if (error instanceof Error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }
      throw new Error('Image upload failed: Unknown error occurred');
    }
  }

  // Publish post to Facebook (user feed or page)
  async publishPost(content: string, pageId?: string, overrideToken?: string): Promise<any> {
    try {
      const token = await this.getAccessToken(overrideToken);
      if (!token) {
        throw new Error('No Facebook access token available. Please reconnect your Facebook account.');
      }
      
      // Validate the token before attempting to publish
      const validation = await this.validateToken(token);
      if (!validation.valid) {
        throw new Error(`Facebook access token is invalid: ${validation.error || 'Unknown error'}. Please reconnect your Facebook account.`);
      }
      
      let accessTokenToUse = token;
      let url = `${this.baseUrl}/me/feed`;
      
      // If a page ID is provided, get the page access token
      if (pageId) {
        console.log('Fetching page access token for page ID:', pageId);
        const pageTokenResponse = await fetch(
          `${this.baseUrl}/${pageId}?fields=access_token&access_token=${token}`
        );
        
        const pageTokenData = await pageTokenResponse.json();
        
        if (!pageTokenResponse.ok) {
          console.error('Error fetching page access token:', pageTokenData);
          const errorMessage = pageTokenData.error?.message || 'Failed to get page access token';
          throw new Error(`Failed to get page access token: ${errorMessage}`);
        }
        
        accessTokenToUse = pageTokenData.access_token;
        url = `${this.baseUrl}/${pageId}/feed`;
        console.log('Using page access token for publishing');
      } else {
        console.log('Using user access token for publishing to personal feed');
      }
      
      // Prepare the post data
      const postData: any = {
        message: content,
        access_token: accessTokenToUse
      };
      
      console.log('Publishing to Facebook:', { url, hasMessage: !!postData.message });
      
      // Publish to Facebook
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Failed to publish to Facebook';
        if (responseData && responseData.error) {
          errorMessage = responseData.error.message || responseData.error.type || errorMessage;
          // Log additional error details for debugging
          console.error('Facebook API error details:', {
            type: responseData.error.type,
            code: responseData.error.code,
            fbtrace_id: responseData.error.fbtrace_id,
            message: responseData.error.message
          });
        }
        
        throw new Error(`Facebook API error: ${errorMessage}`);
      }
      
      console.log('Post published to Facebook successfully:', responseData);
      
      return {
        success: true,
        data: responseData,
        facebook_post_id: responseData.id
      };
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      // Re-throw with more user-friendly message
      if (error instanceof Error) {
        throw new Error(`Publish failed: ${error.message}`);
      }
      throw new Error('Publish failed: Unknown error occurred');
    }
  }

  // Test Facebook connection
  async testConnection(): Promise<{ connected: boolean; user?: any; pages?: any[]; tokenInfo?: any }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return { connected: false };
      }
      
      // Validate token
      const validation = await this.validateToken(token);
      if (!validation.valid) {
        return { connected: false };
      }
      
      // Get user profile
      const profile = await this.getProfile();
      
      // Get pages
      const pages = await this.getPages();
      
      return {
        connected: true,
        user: profile,
        pages: pages,
        tokenInfo: validation
      };
    } catch (error) {
      console.error('Error testing Facebook connection:', error);
      return { connected: false };
    }
  }
}

// Export singleton instance
export const facebookService = new FacebookService();

// Export individual functions for direct use
export const getFacebookToken = () => facebookService.getAccessToken();
export const getFacebookPages = () => facebookService.getPages();
export const getFacebookProfile = () => facebookService.getProfile();
export const publishToFacebook = (content: string, pageId?: string) => 
  facebookService.publishPost(content, pageId);
export const testFacebookConnection = () => facebookService.testConnection();