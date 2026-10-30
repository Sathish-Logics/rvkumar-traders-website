// Adds validated internal notes to an enquiry after owner authorization.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { addEnquiryNote } from "@/services/enquiry.service";
import { enquiryNoteSchema } from "@/validators/enquiry.schema";

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/enquiries/[id]/notes">,
) {
  const admin = await requireActiveAdmin();
  const parsed = enquiryNoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid note", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id } = await params;
  return NextResponse.json(await addEnquiryNote(id, parsed.data.note, admin.id), {
    status: 201,
  });
}
