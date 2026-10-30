// Returns published products publicly and creates products for an authenticated owner.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { createProduct, listPublishedProducts } from "@/services/product.service";
import { productSchema } from "@/validators/product.schema";

export async function GET() {
  return NextResponse.json(await listPublishedProducts());
}

export async function POST(request: Request) {
  await requireActiveAdmin();
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid product", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  return NextResponse.json(await createProduct(parsed.data), { status: 201 });
}
