// Returns normalized customer records to the authenticated owner.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { listCustomers } from "@/services/enquiry.service";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listCustomers());
}
