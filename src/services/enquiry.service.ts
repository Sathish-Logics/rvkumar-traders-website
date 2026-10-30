// Implements enquiry creation, reference generation, listing, and status transitions.
import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { notifyOwnerOfEnquiry } from "@/lib/notifications";
import type { EnquiryInput } from "@/types/enquiry";
import { EnquiryActivityType, type EnquiryStatus } from "@prisma/client";
import type { z } from "zod";
import type { enquiryAdminUpdateSchema } from "@/validators/enquiry.schema";

function createReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ENQ-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createEnquiry(input: EnquiryInput) {
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true, isAvailable: true },
    select: { id: true, name: true },
  });
  const productsById = new Map(products.map((product) => [product.id, product]));

  if (products.length !== new Set(productIds).size) {
    throw new Error("One or more selected products are unavailable.");
  }

  const enquiry = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: input.phone },
      update: {
        name: input.customerName,
        ...(input.email ? { email: input.email } : {}),
        updatedAt: new Date(),
      },
      create: {
        name: input.customerName,
        phone: input.phone,
        email: input.email || null,
      },
      select: { id: true },
    });

    const created = await tx.enquiry.create({
      data: {
        reference: createReference(),
        customerName: input.customerName,
        phone: input.phone,
        email: input.email || null,
        location: input.location,
        pinCode: input.pinCode,
        preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
        instructions: input.instructions || null,
        customerId: customer.id,
        leadSource: "website",
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            productName: productsById.get(item.productId)!.name,
            quantity: item.quantity,
            unit: item.unit,
          })),
        },
        activities: {
          create: {
            type: EnquiryActivityType.CREATED,
            note: "Enquiry received from the website",
            metadata: { source: "website" },
          },
        },
      },
      select: { id: true, reference: true },
    });

    await tx.auditEvent.create({
      data: {
        actorType: "public",
        action: "enquiry.created",
        entityType: "enquiry",
        entityId: created.id,
        afterData: { reference: created.reference, status: "NEW" },
        reason: "Customer submitted quotation enquiry",
      },
    });
    return created;
  });

  await notifyOwnerOfEnquiry(enquiry, input);
  return enquiry;
}

export async function listEnquiries() {
  return prisma.enquiry.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEnquiry(id: string) {
  return prisma.enquiry.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
      activities: {
        include: { actor: { select: { displayName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateEnquiryWorkflow(
  id: string,
  input: z.infer<typeof enquiryAdminUpdateSchema>,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.enquiry.findUniqueOrThrow({
      where: { id },
      select: { status: true, followUpAt: true },
    });

    const data: { status?: EnquiryStatus; followUpAt?: Date | null } = {};
    if (input.status !== undefined) data.status = input.status;
    if (input.followUpAt !== undefined) {
      data.followUpAt = input.followUpAt ? new Date(input.followUpAt) : null;
    }

    const updated = await tx.enquiry.update({ where: { id }, data });

    if (input.status !== undefined && input.status !== before.status) {
      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId,
          type: EnquiryActivityType.STATUS_CHANGED,
          note: `Status changed from ${before.status} to ${input.status}`,
          metadata: { before: before.status, after: input.status },
        },
      });
    }

    if (input.followUpAt !== undefined) {
      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId,
          type: EnquiryActivityType.FOLLOW_UP_SET,
          note: input.followUpAt ? "Follow-up scheduled" : "Follow-up cleared",
          metadata: {
            before: before.followUpAt?.toISOString() ?? null,
            after: input.followUpAt,
          },
        },
      });
    }

    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "enquiry.workflow_updated",
        entityType: "enquiry",
        entityId: id,
        beforeData: {
          status: before.status,
          followUpAt: before.followUpAt?.toISOString() ?? null,
        },
        afterData: {
          status: updated.status,
          followUpAt: updated.followUpAt?.toISOString() ?? null,
        },
        reason: "Owner updated enquiry workflow",
      },
    });
    return updated;
  });
}

export async function addEnquiryNote(id: string, note: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.enquiry.findUniqueOrThrow({ where: { id }, select: { id: true } });
    const activity = await tx.enquiryActivity.create({
      data: {
        enquiryId: id,
        actorId,
        type: EnquiryActivityType.NOTE,
        note,
      },
      include: { actor: { select: { displayName: true } } },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "enquiry.note_added",
        entityType: "enquiry",
        entityId: id,
        afterData: { activityId: activity.id },
        reason: "Owner added an internal enquiry note",
      },
    });
    return activity;
  });
}

export async function listCustomers() {
  return prisma.customer.findMany({
    include: {
      _count: { select: { enquiries: true } },
      enquiries: {
        select: { id: true, reference: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCustomer(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      enquiries: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateCustomer(
  id: string,
  input: { name?: string; email?: string | null },
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.customer.findUniqueOrThrow({ where: { id } });
    const customer = await tx.customer.update({
      where: { id },
      data: { ...input, email: input.email || null, updatedAt: new Date() },
    });
    await tx.auditEvent.create({
      data: {
        actorType: "admin",
        actorId,
        action: "customer.updated",
        entityType: "customer",
        entityId: id,
        beforeData: { name: before.name, email: before.email },
        afterData: { name: customer.name, email: customer.email },
      },
    });
    return customer;
  });
}
