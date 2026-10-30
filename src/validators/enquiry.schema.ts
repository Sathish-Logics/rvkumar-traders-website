// Validates and normalizes public multi-product quotation enquiry input.
import { z } from "zod";

export const enquiryItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive().max(100000),
  unit: z.string().trim().min(1).max(30),
});

export const enquirySchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number."),
  email: z.string().trim().email().optional().or(z.literal("")),
  location: z.string().trim().min(2).max(200),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid six-digit PIN code."),
  preferredDate: z.string().date().optional().or(z.literal("")),
  instructions: z.string().trim().max(1000).optional().or(z.literal("")),
  items: z.array(enquiryItemSchema).min(1).max(20),
});

export const enquiryStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "QUOTATION_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ]),
});

export const enquiryAdminUpdateSchema = z
  .object({
    status: enquiryStatusSchema.shape.status.optional(),
    followUpAt: z.string().datetime({ offset: true }).nullable().optional(),
  })
  .refine((value) => value.status !== undefined || value.followUpAt !== undefined, {
    message: "Provide a status or follow-up date.",
  });

export const enquiryNoteSchema = z.object({
  note: z.string().trim().min(1).max(2000),
});

export const customerUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.union([z.email(), z.literal(""), z.null()]).optional(),
  })
  .refine((value) => value.name !== undefined || value.email !== undefined, {
    message: "At least one customer field is required",
  });
