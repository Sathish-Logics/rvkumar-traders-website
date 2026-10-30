// Applies validated and audited order-state transitions.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { updateOrder } from "@/services/operations.service";
import { orderUpdateSchema } from "@/validators/operations.schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireActiveAdmin();
  const parsed = orderUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
  try {
    const { id } = await params;
    return NextResponse.json(await updateOrder(id, parsed.data, admin.id));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update order" },
      { status: 422 },
    );
  }
}
