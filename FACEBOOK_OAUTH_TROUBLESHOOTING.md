# Facebook OAuth Troubleshooting Guide

## Issue Description
You're getting "Authentication failed: server_error - Error getting user profile from external provider" when trying to log in with Facebook.

## Possible Causes

1. **Facebook App Configuration Issues**
   - Incorrect redirect URLs in Facebook App settings
   - App not in development mode or not properly configured
   - Missing or incorrect app credentials

2. **Scope Permission Issues**
   - Requesting scopes that your app doesn't have approval for
   - Too many scopes requested at once

3. **Brave Browser Privacy Settings**
   - Brave's shields blocking the OAuth flow
   - Strict tracking protection interfering with Facebook login

## Troubleshooting Steps

### Step 1: Check Facebook App Settings
1. Go to https://developers.facebook.com/
2. Navigate to your app settings
3. Check that "http://localhost:3002/auth/callback" is in the Valid OAuth Redirect URIs
4. Make sure your app is in development mode

### Step 2: Try with Reduced Scopes
Try logging in with fewer scopes to see if that works:
- Temporarily change the scope in `/src/lib/auth.ts` to just: `public_profile,email`

### Step 3: Check Brave Browser Settings
1. Disable Brave Shields for localhost
2. Try in a different browser (Chrome, Firefox) to see if it's browser-specific

### Step 4: Manual Token Testing
If OAuth continues to fail, you can manually get a token:
1. Visit https://developers.facebook.com/tools/explorer/
2. Select your app
3. Generate a token with the required scopes
4. Copy the token and use the debug page at http://localhost:3002/debug-facebook.html

### Step 5: Check Supabase Configuration
1. Verify that your Supabase project has Facebook OAuth properly configured
2. Check that the redirect URL matches exactly

## Temporary Workaround
If OAuth is not working, you can manually set your Facebook token:
1. Get a token from Facebook Graph API Explorer
2. Visit http://localhost:3002/debug-facebook.html
3. Use the "Manual Token Entry" section to set your token
4. Test that it works with the "Test Token" and "Test Pages" buttons

## Need Help?
If none of these steps work, please provide:
1. The exact error message from the browser console
2. Screenshots of your Facebook App settings
3. Whether this works in other browsers