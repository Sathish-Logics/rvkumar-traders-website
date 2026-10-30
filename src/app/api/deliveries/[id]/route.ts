// Applies validated and audited delivery-state transitions.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { updateDelivery } from "@/services/operations.service";
import { deliveryUpdateSchema } from "@/validators/operations.schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireActiveAdmin();
  const parsed = deliveryUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid delivery update" }, { status: 400 });
  try {
    const { id } = await params;
    return NextResponse.json(await updateDelivery(id, parsed.data, admin.id));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update delivery" },
      { status: 422 },
    );
  }
}
