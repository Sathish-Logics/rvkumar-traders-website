// Issues a short-lived private proof-of-delivery upload URL to the owner.
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActiveAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProofUpload } from "@/lib/storage";

const requestSchema = z.object({
  extension: z.enum(["jpg", "jpeg", "png", "webp", "pdf"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireActiveAdmin();
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Unsupported proof file type" }, { status: 400 });
  const { id } = await params;
  const exists = await prisma.delivery.count({ where: { id } });
  if (!exists)
    return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
  try {
    return NextResponse.json(await createProofUpload(id, parsed.data.extension));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare upload" },
      { status: 503 },
    );
  }
}
