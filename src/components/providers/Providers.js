"use client";

import { AuthProvider } from "@/contexts/auth-context";

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('@supabase/supabase-js').User | null} props.initialUser
 */
export function Providers({ children, initialUser }) {
  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
