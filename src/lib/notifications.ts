// Queues and delivers provider-backed email/SMS notifications without blocking enquiry storage.
import "server-only";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { EnquiryCreated, EnquiryInput } from "@/types/enquiry";

function key(parts: string[]) {
  return createHash("sha256").update(parts.join(":"), "utf8").digest("hex");
}

export async function notifyOwnerOfEnquiry(
  enquiry: EnquiryCreated,
  input: EnquiryInput,
) {
  const messages: Array<{
    channel: "EMAIL" | "SMS";
    destination: string;
    template: string;
    payload: Record<string, string>;
    idempotencyKey: string;
  }> = [];
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  const ownerPhone = process.env.OWNER_NOTIFICATION_PHONE;
  const payload = {
    reference: enquiry.reference,
    customerName: input.customerName,
    phone: input.phone,
    location: input.location,
  };

  if (ownerEmail)
    messages.push({
      channel: "EMAIL",
      destination: ownerEmail,
      template: "owner_new_enquiry",
      payload,
      idempotencyKey: key([enquiry.id, "owner", "email"]),
    });
  if (ownerPhone)
    messages.push({
      channel: "SMS",
      destination: ownerPhone,
      template: "owner_new_enquiry",
      payload,
      idempotencyKey: key([enquiry.id, "owner", "sms"]),
    });
  if (input.email)
    messages.push({
      channel: "EMAIL",
      destination: input.email,
      template: "customer_enquiry_acknowledgement",
      payload: { reference: enquiry.reference, customerName: input.customerName },
      idempotencyKey: key([enquiry.id, "customer", "email"]),
    });

  if (!messages.length)
    return { queued: 0, reason: "destinations_not_configured" } as const;
  await prisma.notificationOutbox.createMany({ data: messages, skipDuplicates: true });
  return { queued: messages.length } as const;
}

function render(template: string, payload: Record<string, unknown>) {
  if (template === "customer_enquiry_acknowledgement")
    return {
      subject: `Enquiry received — ${String(payload.reference)}`,
      text: `Hello ${String(payload.customerName)}, RVKumar Traders received your material enquiry. Reference: ${String(payload.reference)}. This acknowledgement is not an order confirmation.`,
    };
  return {
    subject: `New website enquiry — ${String(payload.reference)}`,
    text: `New enquiry ${String(payload.reference)} from ${String(payload.customerName)} (${String(payload.phone)}) for delivery around ${String(payload.location)}.`,
  };
}

async function sendEmail(destination: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !from) throw new Error("Email provider is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [destination], subject, text }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return (await response.json()) as { id?: string };
}

async function sendSms(destination: string, text: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !token || !from) throw new Error("SMS provider is not configured");
  const body = new URLSearchParams({ To: destination, From: from, Body: text });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );
  if (!response.ok) throw new Error(`SMS provider returned ${response.status}`);
  return (await response.json()) as { sid?: string };
}

export async function processNotificationOutbox(limit = 20) {
  const records = await prisma.notificationOutbox.findMany({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      nextAttemptAt: { lte: new Date() },
      attempts: { lt: 5 },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  let sent = 0;
  for (const record of records) {
    await prisma.notificationOutbox.update({
      where: { id: record.id },
      data: { status: "PROCESSING", attempts: { increment: 1 } },
    });
    try {
      const message = render(
        record.template,
        record.payload as Record<string, unknown>,
      );
      let providerId: string | undefined;
      if (record.channel === "EMAIL") {
        providerId = (
          await sendEmail(record.destination, message.subject, message.text)
        ).id;
      } else {
        providerId = (await sendSms(record.destination, message.text)).sid;
      }
      await prisma.notificationOutbox.update({
        where: { id: record.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          providerId,
          lastError: null,
        },
      });
      sent += 1;
    } catch (error) {
      const delayMinutes = Math.min(60, 2 ** (record.attempts + 1));
      await prisma.notificationOutbox.update({
        where: { id: record.id },
        data: {
          status: "FAILED",
          lastError:
            error instanceof Error
              ? error.message.slice(0, 500)
              : "Unknown provider error",
          nextAttemptAt: new Date(Date.now() + delayMinutes * 60_000),
        },
      });
    }
  }
  return { processed: records.length, sent };
}
