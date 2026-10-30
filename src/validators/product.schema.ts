// Validates product create and update payloads received by protected admin APIs.
import { z } from "zod";

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2).max(120),
  brand: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().min(5).max(500),
  unit: z.string().trim().min(1).max(30),
  imageUrl: z.string().trim().min(1).max(500),
  isPublished: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

export const productUpdateSchema = productSchema.partial();
