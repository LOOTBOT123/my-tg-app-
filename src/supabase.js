import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY"

if (!SUPABASE_URL.startsWith("https://") || !SUPABASE_ANON_KEY) {
  console.error("[NEXLOT] Supabase не сконфигурирован — проверьте URL/anon key")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})https://zqlvrqtsugscaiczorry.supabase.co
sb_publishable_QxPXGj8dsZu0FN4pDfTLAQ_FFt8sDX0
