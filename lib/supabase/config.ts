/**
 * Central Supabase configuration + a single source of truth for whether the
 * project has been wired up yet. Until the two NEXT_PUBLIC_SUPABASE_* env vars
 * are present, `isSupabaseConfigured` is false and the app runs in its previous
 * open (ungated, no-auth) mode — so the build and preview never break before
 * you create the Supabase project.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
