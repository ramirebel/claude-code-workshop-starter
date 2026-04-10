import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseUrlAndKey } from './env'

export function createClient() {
  const { url, key } = getSupabaseUrlAndKey()
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local'
    )
  }
  return createBrowserClient(url, key)
}
