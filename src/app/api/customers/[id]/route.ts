// Returns one customer with complete enquiry history to the authenticated owner.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { getCustomer, updateCustomer } from "@/services/enquiry.service";
import { customerUpdateSchema } from "@/validators/enquiry.schema";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/customers/[id]">,
) {
  await requireActiveAdmin();
  const { id } = await params;
  const customer = await getCustomer(id);
  return customer
    ? NextResponse.json(customer)
    : NextResponse.json({ error: "Customer not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/customers/[id]">,
) {
  const admin = await requireActiveAdmin();
  const parsed = customerUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid customer update" }, { status: 400 });
  const { id } = await params;
  return NextResponse.json(await updateCustomer(id, parsed.data, admin.id));
}
