// Lists private quotations and creates an audited quotation draft.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { createQuotation, listQuotations } from "@/services/operations.service";
import { quotationSchema } from "@/validators/operations.schema";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listQuotations());
}
export async function POST(request: Request) {
  const admin = await requireActiveAdmin();
  const parsed = quotationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid quotation", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  try {
    return NextResponse.json(await createQuotation(parsed.data, admin.id), {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create quotation" },
      { status: 422 },
    );
  }
}
