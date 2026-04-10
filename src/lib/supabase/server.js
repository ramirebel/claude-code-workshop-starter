import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseUrlAndKey } from './env'

export async function createClient() {
  const { url, key } = getSupabaseUrlAndKey()
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local'
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component; middleware refreshes the session.
        }
      },
    },
  })
}
