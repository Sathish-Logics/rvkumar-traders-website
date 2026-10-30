// Lists manually recorded payments and records an audited payment.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { listPayments, recordPayment } from "@/services/operations.service";
import { paymentCreateSchema } from "@/validators/operations.schema";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listPayments());
}
export async function POST(request: Request) {
  const admin = await requireActiveAdmin();
  const parsed = paymentCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid payment", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  try {
    return NextResponse.json(await recordPayment(parsed.data, admin.id), {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to record payment" },
      { status: 422 },
    );
  }
}
