// Reverses a payment without deleting its financial history.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { reversePayment } from "@/services/operations.service";
import { paymentReverseSchema } from "@/validators/operations.schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireActiveAdmin();
  const parsed = paymentReverseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "A reversal reason is required" },
      { status: 400 },
    );
  try {
    const { id } = await params;
    return NextResponse.json(await reversePayment(id, parsed.data.reason, admin.id));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reverse payment" },
      { status: 422 },
    );
  }
}
