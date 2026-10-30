// Returns one quotation and applies a validated lifecycle decision.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { decideQuotation, getQuotation } from "@/services/operations.service";
import { quotationDecisionSchema } from "@/validators/operations.schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireActiveAdmin();
  const { id } = await params;
  const record = await getQuotation(id);
  return record
    ? NextResponse.json(record)
    : NextResponse.json({ error: "Quotation not found" }, { status: 404 });
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireActiveAdmin();
  const parsed = quotationDecisionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid quotation decision" }, { status: 400 });
  try {
    const { id } = await params;
    return NextResponse.json(await decideQuotation(id, parsed.data.action, admin.id));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update quotation" },
      { status: 422 },
    );
  }
}
