// Verifies the Supabase session and loads the active owner profile through Prisma.
import "server-only";

import { AppRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthBypassEnabled } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type ActiveAdmin = {
  id: string;
  displayName: string;
  role: "owner";
  isBypass: boolean;
};

export async function requireActiveAdmin(): Promise<ActiveAdmin> {
  if (isAdminAuthBypassEnabled()) {
    const profile = await prisma.adminProfile.findFirst({
      where: { isActive: true, role: AppRole.OWNER },
      select: { id: true, displayName: true },
    });

    if (!profile) redirect("/admin/login?error=bypass_profile");

    return {
      id: profile.id,
      displayName: profile.displayName,
      role: "owner",
      isBypass: true,
    };
  }

  let supabase;
  let configurationFailed = false;

  try {
    supabase = await createClient();
  } catch {
    configurationFailed = true;
  }

  if (configurationFailed || !supabase) {
    redirect("/admin/login?error=configuration");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const profile = await prisma.adminProfile.findFirst({
    where: {
      id: user.id,
      isActive: true,
    },
    select: {
      id: true,
      displayName: true,
      role: true,
    },
  });

  if (!profile || profile.role !== AppRole.OWNER) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return {
    id: profile.id,
    displayName: profile.displayName,
    role: "owner",
    isBypass: false,
  };
}
