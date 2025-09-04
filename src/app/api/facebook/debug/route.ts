// Facebook Debug API Endpoint
// This endpoint helps debug Facebook integration issues

import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return new Response(JSON.stringify({ error: 'Failed to get session' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'No active session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the provider token (Facebook access token)
    const facebookAccessToken = session.provider_token;
    
    // Also check for token in request headers as fallback
    const tokenFromHeader = request.headers.get('x-facebook-token');
    
    // Prepare debug information
    const debugInfo = {
      sessionExists: !!session,
      facebookTokenFromSession: !!facebookAccessToken,
      facebookTokenFromHeader: !!tokenFromHeader,
      userId: session?.user?.id,
      provider: session?.user?.app_metadata?.provider,
      hasFacebookProvider: session?.user?.identities?.some(identity => identity.provider === 'facebook')
    };
    
    // If we have a token, test it
    const tokenToTest = facebookAccessToken || tokenFromHeader;
    
    if (tokenToTest) {
      try {
        // Test token validity first
        const tokenValidationResponse = await fetch(
          `https://graph.facebook.com/v19.0/debug_token?input_token=${tokenToTest}&access_token=${tokenToTest}`
        );
        
        const tokenValidationData = await tokenValidationResponse.json();
        debugInfo.tokenValidation = {
          isValid: tokenValidationResponse.ok,
          data: tokenValidationData
        };
        
        // Test user profile access
        const userResponse = await fetch(
          `https://graph.facebook.com/v19.0/me?access_token=${tokenToTest}&fields=id,name,email`
        );
        
        const userData = await userResponse.json();
        debugInfo.userProfileAccessible = userResponse.ok;
        debugInfo.userProfile = userData;
        
        if (userResponse.ok) {
          // Test pages access
          const pagesResponse = await fetch(
            `https://graph.facebook.com/v19.0/me/accounts?access_token=${tokenToTest}&fields=name,id,category,picture,fan_count`
          );
          
          const pagesData = await pagesResponse.json();
          debugInfo.pagesAccessible = pagesResponse.ok;
          debugInfo.pagesData = pagesData;
          debugInfo.pagesCount = pagesData.data ? pagesData.data.length : 0;
          
          // Additional debug info for empty pages
          if (pagesData.data && pagesData.data.length === 0) {
            debugInfo.pagesEmptyReasons = [
              'User may not have any Facebook pages',
              'Token may lack pages_show_list permission',
              'User account may be personal rather than business'
            ];
          }
        }
      } catch (testError) {
        console.error('Facebook token test error:', testError);
        debugInfo.tokenTestError = testError.message;
      }
    } else {
      debugInfo.noTokenReason = 'No Facebook token found in session or headers';
    }
    
    console.log('Facebook debug info:', debugInfo);
    
    return new Response(JSON.stringify(debugInfo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Facebook debug error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}