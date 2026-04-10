import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getSupabaseUrlAndKey } from './env'

/** Refreshes the auth session and syncs cookies (run from proxy / edge). */
export async function updateSession(request) {
  const { url, key } = getSupabaseUrlAndKey()
  if (!url || !key) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
        if (headers) {
          Object.entries(headers).forEach(([k, v]) =>
            supabaseResponse.headers.set(k, v)
          )
        }
      },
    },
  })

  await supabase.auth.getUser()
  return supabaseResponse
}
