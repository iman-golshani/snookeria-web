import { createClient } from "@supabase/supabase-js";

const cmsSupabaseUrl = process.env.NEXT_PUBLIC_CMS_SUPABASE_URL;
const cmsSupabaseAnonKey = process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY;

if (!cmsSupabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_CMS_SUPABASE_URL environment variable");
}

if (!cmsSupabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY environment variable");
}

export const cmsSupabase = createClient(cmsSupabaseUrl, cmsSupabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
