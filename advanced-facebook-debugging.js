// FACEBOOK PAGES NOT SHOWING - ADVANCED DEBUGGING
// This will help diagnose why your pages aren't showing despite having them

console.log(`
====================================================
🔍 FACEBOOK PAGES DEBUGGING - ADVANCED MODE 🔍
====================================================

CURRENT STATUS:
────────────────────────────────────────────────────
`);

console.log(`
❌ YOUR ACTUAL ISSUE:
   ─────────────────
   • You HAVE Facebook pages (7+ connected)
   • You've GRANTED access to Zenith
   • Pages are NOT showing in the app
   • Getting "No active session" when posting
   • This is an AUTHENTICATION/SYNC issue
`);

console.log(`
✅ WHAT WE KNOW WORKS:
   ──────────────────
   • Facebook OAuth flow completes
   • Token gets stored in localStorage
   • Basic connection is established
   • You can see "Connected" status
`);

console.log(`
====================================================
🔧 IMMEDIATE DEBUGGING STEPS
====================================================

ACTION ITEMS - DO THESE NOW:
────────────────────────────────────────────────────
`);

console.log(`
1. 🔍 CHECK BROWSER CONSOLE:
   ────────────────────────
   Press F12 → Console tab
   Look for any red error messages
   Copy any Facebook-related errors
`);

console.log(`
2. 🧪 TEST TOKEN MANUALLY:
   ──────────────────────
   In browser Console, run:
   
   const token = localStorage.getItem('facebook_access_token');
   console.log('Token exists:', !!token);
   console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'NONE');
   
   // Test token validity
   fetch(\`https://graph.facebook.com/v19.0/me?access_token=\${token}&fields=id,name,email\`)
     .then(res => res.json())
     .then(data => console.log('User data:', data));
   
   // Test pages access
   fetch(\`https://graph.facebook.com/v19.0/me/accounts?access_token=\${token}&fields=name,id,category,picture,fan_count\`)
     .then(res => res.json())
     .then(data => console.log('Pages data:', data));
`);

console.log(`
3. 🔐 CHECK TOKEN PERMISSIONS:
   ─────────────────────────
   Visit: https://developers.facebook.com/tools/debug/accesstoken/
   Paste your token and check:
   • Expires: Should be valid
   • Scopes: Should include:
     - pages_show_list
     - pages_read_engagement  
     - pages_manage_posts
     - pages_manage_metadata
     - pages_read_user_content
`);

console.log(`
====================================================
🧨 COMMON ROOT CAUSES
====================================================

LIKELY ISSUES:
────────────────────────────────────────────────────
`);

console.log(`
🔥 ISSUE 1: SESSION MISMATCH
   ─────────────────────────
   • Supabase session != Facebook token session
   • Token stored but not linked to current session
   • Causing "No active session" error
`);

console.log(`
🔥 ISSUE 2: TOKEN SCOPE LIMITATIONS
   ──────────────────────────────────
   • Token has basic access but limited page permissions
   • Pages require specific page-level tokens
   • Missing required Facebook scopes
`);

console.log(`
🔥 ISSUE 3: PAGE ACCESS TOKENS
   ────────────────────────────
   • User token ≠ Page tokens
   • Need individual page access tokens
   • Facebook requires page-specific permissions
`);

console.log(`
====================================================
⚡ IMMEDIATE SOLUTIONS
====================================================

TRY THESE FIXES NOW:
────────────────────────────────────────────────────
`);

console.log(`
✅ SOLUTION 1: COMPLETE RE-AUTHENTICATION
   ────────────────────────────────────────
   
   1. Clear ALL Facebook tokens:
      localStorage.removeItem('facebook_access_token');
      localStorage.removeItem('facebook_auth_completed');
      localStorage.removeItem('supabase_access_token');
      localStorage.removeItem('supabase_refresh_token');
   
   2. Log out of Zenith completely
   3. Close browser entirely
   4. Reopen browser
   5. Go to http://localhost:3001/login
   6. Click "Connect with Facebook"
   7. Grant ALL permissions when prompted
   8. Complete full OAuth flow
`);

console.log(`
✅ SOLUTION 2: CHECK SUPABASE AUTH PROVIDER
   ─────────────────────────────────────────
   
   1. Go to Supabase Dashboard
   2. Navigate to Authentication → Providers
   3. Check Facebook provider settings
   4. Verify Redirect URLs include:
      http://localhost:3001/auth/callback
   5. Check required scopes match:
      pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_read_user_content
`);

console.log(`
✅ SOLUTION 3: MANUAL TOKEN TESTING
   ─────────────────────────────────
   
   1. Get your token from localStorage:
      const token = localStorage.getItem('facebook_access_token');
   
   2. Test with Graph API Explorer:
      https://developers.facebook.com/tools/explorer/
   
   3. Try these API calls:
      GET /me?fields=id,name,email
      GET /me/accounts?fields=name,id,category,picture,fan_count
      GET /{page-id}?fields=access_token,name,category (for each page)
`);

console.log(`
====================================================
🛠️  TECHNICAL DEBUGGING
====================================================

DEEP DIVE DEBUGGING:
────────────────────────────────────────────────────
`);

console.log(`
🔬 STEP 1: CHECK TOKEN SOURCE
   ──────────────────────────
   
   Run in browser console:
   
   // Check where token comes from
   console.log('Supabase session token:', localStorage.getItem('supabase_access_token'));
   console.log('Facebook provider token:', localStorage.getItem('facebook_access_token'));
   console.log('Auth completion flag:', localStorage.getItem('facebook_auth_completed'));
   
   // Check current session
   fetch('/api/facebook/token')
     .then(res => res.json())
     .then(data => console.log('API token response:', data));
`);

console.log(`
🔬 STEP 2: TEST PAGE ACCESS
   ─────────────────────────
   
   Run in browser console:
   
   const token = localStorage.getItem('facebook_access_token');
   
   // Get basic user info
   fetch(\`https://graph.facebook.com/v19.0/me?access_token=\${token}&fields=id,name\`)
     .then(res => res.json())
     .then(user => {
       console.log('User info:', user);
       
       // Get pages list
       return fetch(\`https://graph.facebook.com/v19.0/\${user.id}/accounts?access_token=\${token}&fields=name,id,category,picture\`);
     })
     .then(res => res.json())
     .then(pages => console.log('Pages response:', pages))
     .catch(err => console.error('Error:', err));
`);

console.log(`
🔬 STEP 3: CHECK SESSION STATE
   ───────────────────────────
   
   Run in browser console:
   
   // Check current session
   fetch('/api/facebook/token')
     .then(res => {
       console.log('Token API status:', res.status);
       return res.json();
     })
     .then(data => console.log('Token API response:', data))
     .catch(err => console.error('Token API error:', err));
`);

console.log(`
====================================================
🚨 CRITICAL DEBUGGING INFO NEEDED
====================================================

PLEASE PROVIDE THIS INFORMATION:
────────────────────────────────────────────────────
`);

console.log(`
📋 REQUIRED DEBUG DATA:
   ────────────────────
   
   1. Browser Console Output:
      • Any red error messages
      • Facebook API responses
      • Token validation results
   
   2. Facebook Token Scopes:
      • Visit Facebook Access Token Debugger
      • Paste your token
      • Screenshot showing scopes
   
   3. API Response Data:
      • Output of /me/accounts API call
      • Any error messages from Facebook
   
   4. Session Information:
      • localStorage token values
      • Session expiration times
      • Provider token vs access token
`);

console.log(`
====================================================
💥 ULTIMATE SOLUTION APPROACH
====================================================

COMPREHENSIVE FIX STRATEGY:
────────────────────────────────────────────────────
`);

console.log(`
🎯 PHASE 1: COMPLETE RESET
   ──────────────────────
   
   1. Log out of Zenith completely
   2. Clear ALL localStorage data:
      localStorage.clear();
   3. Close browser entirely
   4. Reopen browser in incognito/private mode
   5. Visit http://localhost:3001
   6. Log in fresh
   7. Connect Facebook with ALL permissions
`);

console.log(`
🎯 PHASE 2: PERMISSION VERIFICATION  
   ────────────────────────────────
   
   1. During Facebook OAuth, verify:
      • Granting ALL requested permissions
      • No permission denials
      • Successful redirect to callback
      • Token stored in localStorage
   
   2. Check Facebook App permissions:
      • pages_show_list ✅
      • pages_read_engagement ✅
      • pages_manage_posts ✅
      • pages_manage_metadata ✅
      • pages_read_user_content ✅
`);

console.log(`
🎯 PHASE 3: API VERIFICATION
   ─────────────────────────
   
   1. Test all API endpoints manually:
      • GET /api/facebook/token
      • POST /api/facebook/publish
      • GET /api/facebook/test
   
   2. Verify Facebook Graph API calls:
      • GET /me (user profile)
      • GET /me/accounts (pages list)
      • GET /{page-id} (individual page)
`);

console.log(`
====================================================
🆘 EMERGENCY TROUBLESHOOTING
====================================================

IF NOTHING ELSE WORKS:
────────────────────────────────────────────────────
`);

console.log(`
🚨 NUCLEAR OPTION:
   ──────────────
   
   1. COMPLETE DATABASE RESET:
      • Delete Supabase project
      • Create new Supabase project
      • Recreate Facebook OAuth app
      • Update environment variables
      • Redeploy Zenith app
   
   2. FACEBOOK DEVELOPER RESET:
      • Delete Facebook App in Developer Portal
      • Create new Facebook App
      • Reconfigure Supabase Auth Provider
      • Update app settings with new credentials
   
   3. CODE-BASE VERIFICATION:
      • Check all API endpoints
      • Verify token handling logic
      • Test with Postman/curl manually
      • Ensure proper error handling
`);

console.log(`
====================================================
📋 DEBUGGING CHECKLIST
====================================================

MARK EACH STEP AS YOU COMPLETE:
────────────────────────────────────────────────────
`);

console.log(`
✅ STEP 1: Clear all tokens and sessions
   [ ] localStorage.clear()
   [ ] Close browser completely
   [ ] Reopen in incognito mode

✅ STEP 2: Fresh login and connection  
   [ ] Visit http://localhost:3001/login
   [ ] Click "Connect with Facebook"
   [ ] Grant ALL permissions
   [ ] Complete OAuth flow

✅ STEP 3: Check console for errors
   [ ] Open DevTools → Console
   [ ] Look for red error messages
   [ ] Copy any Facebook-related errors

✅ STEP 4: Test token manually
   [ ] Get token from localStorage
   [ ] Test with Graph API Explorer
   [ ] Verify user profile access
   [ ] Verify pages list access

✅ STEP 5: Check token scopes
   [ ] Visit Facebook Access Token Debugger
   [ ] Paste your token
   [ ] Verify all required scopes present

✅ STEP 6: Contact support with data
   [ ] Browser console output
   [ ] Token scope screenshot  
   [ ] API response data
   [ ] Error messages encountered
`);

console.log(`
====================================================
🎯 YOU HAVE PAGES - THE ISSUE IS TECHNICAL!
====================================================

Since you CONFIRMED you have 7+ pages and granted access:

THE PROBLEM IS DEFINITELY TECHNICAL AUTHENTICATION
NOT A MISSING PAGES ISSUE!

This means:
────────────────────────────────────────────────────
`);

console.log(`
❌ NOT THIS: Missing Facebook Pages
✅ ACTUAL ISSUE: Token/session mismatch

❌ NOT THIS: Facebook account without pages  
✅ ACTUAL ISSUE: Authentication flow broken

❌ NOT THIS: Need to create pages
✅ ACTUAL ISSUE: Token permissions/scopes wrong

THE SOLUTION IS TECHNICAL DEBUGGING OF THE AUTH FLOW!
`);

console.log(`
====================================================
🚀 READY FOR ADVANCED DEBUGGING! 🚀
====================================================

Follow the debugging checklist step by step.
The issue is definitely fixable - we just need to 
find where the authentication chain is breaking.

Your pages exist, you've granted access, now we need
to fix the technical connection between Zenith and Facebook.
`);