/** Paths that only guests should see (logged-in users are redirected home). */
export const AUTH_ONLY_PATHS = ["/login", "/signup"];

/** Paths that require a session (prefix match). */
export const PROTECTED_PATH_PREFIXES = ["/account", "/new"];

export function isAuthOnlyPath(pathname) {
  return AUTH_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function isProtectedPath(pathname) {
  return PROTECTED_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
