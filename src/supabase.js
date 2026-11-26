import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://netlify.app'
const SUPABASE_ANON_KEY = 'sb_publishable_QxPXGj8esZw0fN6pOFTLAQ_FFt8c0X0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
