// Returns the protected operational dashboard summary.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { getDashboardReport } from "@/services/operations.service";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await getDashboardReport());
}
