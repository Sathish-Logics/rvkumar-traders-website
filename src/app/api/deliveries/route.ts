// Lists deliveries and schedules a delivery for an existing order.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { createDelivery, listDeliveries } from "@/services/operations.service";
import { deliveryCreateSchema } from "@/validators/operations.schema";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listDeliveries());
}
export async function POST(request: Request) {
  const admin = await requireActiveAdmin();
  const parsed = deliveryCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid delivery", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  try {
    return NextResponse.json(await createDelivery(parsed.data, admin.id), {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to schedule delivery" },
      { status: 422 },
    );
  }
}
