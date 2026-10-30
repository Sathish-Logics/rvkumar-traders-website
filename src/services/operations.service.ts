// Implements audited quotation, order, delivery, payment, and reporting workflows.
import "server-only";
import { randomBytes } from "node:crypto";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import type {
  deliveryCreateSchema,
  deliveryUpdateSchema,
  orderCreateSchema,
  orderUpdateSchema,
  paymentCreateSchema,
  quotationSchema,
} from "@/validators/operations.schema";

function reference(prefix: string) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

const orderTransitions = {
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
} as const;

const deliveryTransitions = {
  SCHEDULED: ["PREPARING", "CANCELLED"],
  PREPARING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["PARTIALLY_DELIVERED", "DELIVERED", "FAILED"],
  PARTIALLY_DELIVERED: [],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: [],
} as const;

export async function createQuotation(
  input: z.infer<typeof quotationSchema>,
  actorId: string,
) {
  const lines = input.items.map((item) => {
    const taxable = item.quantity * item.unitRate;
    const taxAmount = taxable * (item.taxRate / 100);
    return { ...item, taxable, taxAmount, lineTotal: taxable + taxAmount };
  });
  const subtotal = lines.reduce((sum, item) => sum + item.taxable, 0);
  const taxTotal = lines.reduce((sum, item) => sum + item.taxAmount, 0);
  const grandTotal = Math.max(
    0,
    subtotal + taxTotal + input.transportationCharge - input.discountAmount,
  );

  return prisma.$transaction(async (tx) => {
    const enquiry = await tx.enquiry.findUniqueOrThrow({
      where: { id: input.enquiryId },
      select: { customerId: true },
    });
    const latest = await tx.quotation.aggregate({
      where: { enquiryId: input.enquiryId },
      _max: { version: true },
    });
    const quotation = await tx.quotation.create({
      data: {
        reference: reference("QUO"),
        enquiryId: input.enquiryId,
        customerId: enquiry.customerId,
        version: (latest._max.version ?? 0) + 1,
        transportationCharge: input.transportationCharge,
        discountAmount: input.discountAmount,
        subtotal,
        taxTotal,
        grandTotal,
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
        paymentTerms: input.paymentTerms,
        deliveryTerms: input.deliveryTerms,
        notes: input.notes,
        createdById: actorId,
        items: { create: lines },
      },
      include: { items: true },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "quotation.created",
        entityType: "quotation",
        entityId: quotation.id,
        afterData: { reference: quotation.reference, version: quotation.version },
      },
    });
    return quotation;
  });
}

export function listQuotations() {
  return prisma.quotation.findMany({
    include: { customer: true, enquiry: true, items: true, order: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getQuotation(id: string) {
  return prisma.quotation.findUnique({
    where: { id },
    include: { customer: true, enquiry: true, items: true, order: true },
  });
}

export async function decideQuotation(id: string, action: string, actorId: string) {
  const target = {
    ISSUE: "ISSUED",
    ACCEPT: "ACCEPTED",
    REJECT: "REJECTED",
    EXPIRE: "EXPIRED",
  }[action];
  if (!target) throw new Error("Unsupported quotation action");
  return prisma.$transaction(async (tx) => {
    const before = await tx.quotation.findUniqueOrThrow({ where: { id } });
    const allowed =
      before.status === "DRAFT"
        ? ["ISSUED"]
        : before.status === "ISSUED"
          ? ["ACCEPTED", "REJECTED", "EXPIRED"]
          : [];
    if (!allowed.includes(target))
      throw new Error(`Cannot change ${before.status} quotation to ${target}`);
    const updated = await tx.quotation.update({
      where: { id },
      data: {
        status: target as "ISSUED" | "ACCEPTED" | "REJECTED" | "EXPIRED",
        issuedAt: target === "ISSUED" ? new Date() : before.issuedAt,
        acceptedAt: target === "ACCEPTED" ? new Date() : before.acceptedAt,
      },
    });
    await tx.enquiry.update({
      where: { id: before.enquiryId },
      data: {
        status:
          target === "ACCEPTED"
            ? "WON"
            : target === "ISSUED"
              ? "QUOTATION_SENT"
              : undefined,
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: `quotation.${target.toLowerCase()}`,
        entityType: "quotation",
        entityId: id,
        beforeData: { status: before.status },
        afterData: { status: target },
      },
    });
    return updated;
  });
}

export async function createOrder(
  input: z.infer<typeof orderCreateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const quote = await tx.quotation.findUniqueOrThrow({
      where: { id: input.quotationId },
    });
    if (quote.status !== "ACCEPTED")
      throw new Error("Only an accepted quotation can become an order");
    const order = await tx.order.create({
      data: {
        reference: reference("ORD"),
        quotationId: quote.id,
        customerId: quote.customerId,
        totalAmount: quote.grandTotal,
        address: input.address,
        pinCode: input.pinCode,
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "order.created",
        entityType: "order",
        entityId: order.id,
        afterData: { reference: order.reference, status: order.status },
      },
    });
    return order;
  });
}

export function listOrders() {
  return prisma.order.findMany({
    include: { customer: true, quotation: true, deliveries: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrder(
  id: string,
  input: z.infer<typeof orderUpdateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.order.findUniqueOrThrow({ where: { id } });
    if (!(orderTransitions[before.status] as readonly string[]).includes(input.status))
      throw new Error(
        `Invalid order transition from ${before.status} to ${input.status}`,
      );
    if (input.status === "CANCELLED" && !input.reason)
      throw new Error("Cancellation reason is required");
    const order = await tx.order.update({
      where: { id },
      data: {
        status: input.status,
        cancelledAt: input.status === "CANCELLED" ? new Date() : null,
        cancelReason: input.status === "CANCELLED" ? input.reason : null,
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "order.status_changed",
        entityType: "order",
        entityId: id,
        beforeData: { status: before.status },
        afterData: { status: order.status },
        reason: input.reason,
      },
    });
    return order;
  });
}

export async function createDelivery(
  input: z.infer<typeof deliveryCreateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    await tx.order.findUniqueOrThrow({ where: { id: input.orderId } });
    const delivery = await tx.delivery.create({
      data: {
        ...input,
        reference: reference("DLV"),
        scheduledDate: new Date(input.scheduledDate),
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "delivery.created",
        entityType: "delivery",
        entityId: delivery.id,
        afterData: { reference: delivery.reference, status: delivery.status },
      },
    });
    return delivery;
  });
}

export function listDeliveries() {
  return prisma.delivery.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { scheduledDate: "asc" },
  });
}

export async function updateDelivery(
  id: string,
  input: z.infer<typeof deliveryUpdateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.delivery.findUniqueOrThrow({ where: { id } });
    if (
      !(deliveryTransitions[before.status] as readonly string[]).includes(input.status)
    )
      throw new Error(
        `Invalid delivery transition from ${before.status} to ${input.status}`,
      );
    const delivery = await tx.delivery.update({
      where: { id },
      data: {
        status: input.status,
        proofPath: input.proofPath,
        notes: input.notes,
        deliveredAt: input.status === "DELIVERED" ? new Date() : null,
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "delivery.status_changed",
        entityType: "delivery",
        entityId: id,
        beforeData: { status: before.status },
        afterData: { status: delivery.status },
      },
    });
    return delivery;
  });
}

export async function recordPayment(
  input: z.infer<typeof paymentCreateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    await tx.order.findUniqueOrThrow({ where: { id: input.orderId } });
    const payment = await tx.payment.create({
      data: {
        ...input,
        reference: reference("PAY"),
        receivedAt: new Date(input.receivedAt),
        recordedById: actorId,
      },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "payment.recorded",
        entityType: "payment",
        entityId: payment.id,
        afterData: { reference: payment.reference, amount: payment.amount.toString() },
      },
    });
    return payment;
  });
}

export function listPayments() {
  return prisma.payment.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { receivedAt: "desc" },
  });
}

export async function reversePayment(id: string, reason: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.payment.findUniqueOrThrow({ where: { id } });
    if (before.status === "REVERSED") throw new Error("Payment is already reversed");
    const payment = await tx.payment.update({
      where: { id },
      data: { status: "REVERSED", reversedAt: new Date(), reversalReason: reason },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "payment.reversed",
        entityType: "payment",
        entityId: id,
        beforeData: { status: before.status },
        afterData: { status: payment.status },
        reason,
      },
    });
    return payment;
  });
}

export async function getDashboardReport() {
  const now = new Date();
  const [
    newEnquiries,
    pendingQuotes,
    confirmedOrders,
    pendingDeliveries,
    followUps,
    orders,
  ] = await Promise.all([
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.quotation.count({ where: { status: { in: ["DRAFT", "ISSUED"] } } }),
    prisma.order.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.delivery.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED"] } } }),
    prisma.enquiry.count({
      where: { followUpAt: { lte: now }, status: { notIn: ["WON", "LOST"] } },
    }),
    prisma.order.findMany({
      select: {
        totalAmount: true,
        payments: { where: { status: "RECORDED" }, select: { amount: true } },
      },
    }),
  ]);
  const outstandingPayments = orders.reduce(
    (sum, order) =>
      sum +
      Math.max(
        0,
        Number(order.totalAmount) -
          order.payments.reduce((paid, payment) => paid + Number(payment.amount), 0),
      ),
    0,
  );
  return {
    newEnquiries,
    pendingQuotes,
    confirmedOrders,
    pendingDeliveries,
    followUps,
    outstandingPayments,
  };
}
