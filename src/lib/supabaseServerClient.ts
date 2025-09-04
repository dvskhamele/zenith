import { createClient } from '@supabase/supabase-js'

// For server-side operations, we can use the service role key for full access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qfpvsyhtijwxkmyrqswa.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Server-side client doesn't auto-refresh tokens
    autoRefreshToken: false,
    // Server-side client doesn't persist session
    persistSession: false
  }
})