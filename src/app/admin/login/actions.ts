// Validates owner credentials and creates the Supabase authentication session.
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function login(formData: FormData) {
  const input = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!input.success) redirect("/admin/login?error=invalid_input");

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/admin/login?error=configuration");
  }

  const { error } = await supabase.auth.signInWithPassword(input.data);
  if (error) redirect("/admin/login?error=invalid_credentials");

  redirect("/admin");
}
