import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null | undefined

/**
 * Browser Supabase client (publishable / anon key only).
 * Returns null if env vars are missing.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient !== undefined) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (!url || !key) {
    browserClient = null
    return null
  }

  browserClient = createClient(url, key)
  return browserClient
}
