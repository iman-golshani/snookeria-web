import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SHOOTOUT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SHOOTOUT_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOOTOUT_SUPABASE_URL environment variable"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOOTOUT_SUPABASE_ANON_KEY environment variable"
  );
}

export const shootoutSupabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);