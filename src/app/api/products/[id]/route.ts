// Returns, updates, or hides one product after applying route-specific authorization.
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProduct, updateProduct } from "@/services/product.service";
import { productUpdateSchema } from "@/validators/product.schema";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/products/[id]">,
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({ where: { id, isPublished: true } });
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Product not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/products/[id]">,
) {
  await requireActiveAdmin();
  const parsed = productUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const { id } = await params;
  return NextResponse.json(await updateProduct(id, parsed.data));
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/products/[id]">,
) {
  await requireActiveAdmin();
  const { id } = await params;
  return NextResponse.json(await deleteProduct(id));
}
