import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabaseUrlAndKey } from "./env";
import { isAuthOnlyPath, isProtectedPath } from "@/lib/auth/routes";

/**
 * Copy Set-Cookie headers from the session refresh response onto another response
 * (e.g. redirects) so the browser keeps an up-to-date session.
 */
function applyCookies(from, to) {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value);
  });
}

/** Refreshes the auth session, syncs cookies, and enforces auth route rules. */
export async function updateSession(request) {
  const { url, key } = getSupabaseUrlAndKey();
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        if (headers) {
          Object.entries(headers).forEach(([k, v]) =>
            supabaseResponse.headers.set(k, v)
          );
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (user && isAuthOnlyPath(path)) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    applyCookies(supabaseResponse, redirect);
    return redirect;
  }

  if (!user && isProtectedPath(path)) {
    const login = new URL("/login", request.url);
    const returnTo = `${path}${request.nextUrl.search}`;
    login.searchParams.set("next", returnTo);
    const redirect = NextResponse.redirect(login);
    applyCookies(supabaseResponse, redirect);
    return redirect;
  }

  return supabaseResponse;
}
