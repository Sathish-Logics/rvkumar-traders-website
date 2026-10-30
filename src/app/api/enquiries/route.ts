// Accepts public enquiry creation and returns the protected admin enquiry collection.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { checkEnquiryRateLimit } from "@/lib/rate-limit";
import { createEnquiry, listEnquiries } from "@/services/enquiry.service";
import { enquirySchema } from "@/validators/enquiry.schema";

export async function POST(request: Request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = request.headers.get("origin");
  if (
    origin &&
    configuredOrigin &&
    new URL(origin).origin !== new URL(configuredOrigin).origin
  )
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  if (!(await checkEnquiryRateLimit(request)))
    return NextResponse.json(
      { error: "Too many enquiries. Please try again later." },
      { status: 429 },
    );
  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid enquiry", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  try {
    const enquiry = await createEnquiry(parsed.data);
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save enquiry" },
      { status: 422 },
    );
  }
}

export async function GET() {
  await requireActiveAdmin();
  return NextResponse.json(await listEnquiries());
}
