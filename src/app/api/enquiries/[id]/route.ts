// Returns one protected enquiry and applies validated owner status updates.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { getEnquiry, updateEnquiryWorkflow } from "@/services/enquiry.service";
import { enquiryAdminUpdateSchema } from "@/validators/enquiry.schema";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/enquiries/[id]">,
) {
  await requireActiveAdmin();
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  return enquiry
    ? NextResponse.json(enquiry)
    : NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/enquiries/[id]">,
) {
  const admin = await requireActiveAdmin();
  const parsed = enquiryAdminUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid enquiry update", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  const { id } = await params;
  return NextResponse.json(await updateEnquiryWorkflow(id, parsed.data, admin.id));
}
