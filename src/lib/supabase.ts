import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ryuyrgegqunbtbwbikua.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim().length > 20
    ? createClient(supabaseUrl, supabaseAnonKey.trim())
    : null;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey && supabaseServiceKey.trim().length > 20
    ? createClient(supabaseUrl, supabaseServiceKey.trim(), {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabase || supabaseAdmin);
}
