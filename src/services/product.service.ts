// Implements product catalogue reads and protected product database mutations.
import "server-only";
import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { productSchema, productUpdateSchema } from "@/validators/product.schema";

export async function listPublishedProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
  });
}

export async function listAllProducts() {
  return prisma.product.findMany({ orderBy: { name: "asc" } });
}

export async function getPublishedProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, isPublished: true } });
}

export async function createProduct(input: z.infer<typeof productSchema>) {
  return prisma.product.create({ data: input });
}

export async function updateProduct(
  id: string,
  input: z.infer<typeof productUpdateSchema>,
) {
  return prisma.product.update({ where: { id }, data: input });
}

export async function deleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isPublished: false, isAvailable: false },
  });
}
