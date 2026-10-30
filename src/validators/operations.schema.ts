// Validates private quotation, order, delivery, and payment workflow commands.
import { z } from "zod";

const uuid = z.string().uuid();
const money = z.coerce.number().finite().min(0).max(100_000_000);

export const quotationSchema = z.object({
  enquiryId: uuid,
  transportationCharge: money.default(0),
  discountAmount: money.default(0),
  validUntil: z.iso.date().optional().nullable(),
  paymentTerms: z.string().trim().max(2000).optional().nullable(),
  deliveryTerms: z.string().trim().max(2000).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
  items: z
    .array(
      z.object({
        productId: uuid.optional().nullable(),
        description: z.string().trim().min(1).max(300),
        quantity: z.coerce.number().positive().max(1_000_000),
        unit: z.string().trim().min(1).max(40),
        unitRate: money,
        taxRate: z.coerce.number().min(0).max(100),
      }),
    )
    .min(1)
    .max(50),
});

export const quotationDecisionSchema = z.object({
  action: z.enum(["ISSUE", "ACCEPT", "REJECT", "EXPIRE"]),
});

export const orderCreateSchema = z.object({
  quotationId: uuid,
  address: z.string().trim().min(3).max(1000),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/),
});

export const orderUpdateSchema = z.object({
  status: z.enum([
    "CONFIRMED",
    "PREPARING",
    "DISPATCHED",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ]),
  reason: z.string().trim().min(3).max(1000).optional(),
});

export const deliveryCreateSchema = z.object({
  orderId: uuid,
  scheduledDate: z.iso.date(),
  address: z.string().trim().min(3).max(1000),
  vehicleNumber: z.string().trim().max(30).optional().nullable(),
  driverName: z.string().trim().max(120).optional().nullable(),
  driverPhone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/)
    .optional()
    .nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const deliveryUpdateSchema = z.object({
  status: z.enum([
    "SCHEDULED",
    "PREPARING",
    "DISPATCHED",
    "PARTIALLY_DELIVERED",
    "DELIVERED",
    "FAILED",
    "CANCELLED",
  ]),
  proofPath: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const paymentCreateSchema = z.object({
  orderId: uuid,
  amount: z.coerce.number().positive().max(100_000_000),
  method: z.enum(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "OTHER"]),
  receivedAt: z.iso.datetime(),
  externalRef: z.string().trim().max(120).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
});

export const paymentReverseSchema = z.object({
  reason: z.string().trim().min(3).max(1000),
});
