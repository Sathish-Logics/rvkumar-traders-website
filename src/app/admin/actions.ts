// Contains shared authenticated admin actions such as securely ending the owner session.
"use server";
import { redirect } from "next/navigation";
import { isAdminAuthBypassEnabled } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  if (isAdminAuthBypassEnabled()) redirect("/admin");

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
