import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://zqlvzqtsugscaiczorrysupabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHZycXRzdWdzY2FpY3pvcnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2ODk5MjcsImV4cCI6MjExMTI2NTkyN30.KXLjxqFjjj2aqdQCkHVpZ1O24omUtbq6G5Rl1bfi0-E'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
