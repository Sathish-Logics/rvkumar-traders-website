// Creates the browser-side Supabase client for safe public authentication operations.
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnvironment } from "@/lib/env";

export function createClient() {
  const env = getPublicSupabaseEnvironment();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
