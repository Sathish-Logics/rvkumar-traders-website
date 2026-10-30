// Lists orders and converts an accepted quotation into one confirmed order.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { createOrder, listOrders } from "@/services/operations.service";
import { orderCreateSchema } from "@/validators/operations.schema";

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listOrders());
}
export async function POST(request: Request) {
  const admin = await requireActiveAdmin();
  const parsed = orderCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  try {
    return NextResponse.json(await createOrder(parsed.data, admin.id), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 422 },
    );
  }
}
