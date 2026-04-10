/** @returns {{ url: string, key: string } | { url: undefined, key: undefined }} */
export function getSupabaseUrlAndKey() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    return { url: undefined, key: undefined }
  }
  return { url, key }
}
