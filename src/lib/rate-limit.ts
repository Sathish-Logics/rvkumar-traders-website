// Enforces a database-backed public enquiry limit without storing raw IP addresses.
import "server-only";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function checkEnquiryRateLimit(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const source = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.RATE_LIMIT_SALT || "local-development-rate-limit";
  const fingerprint = createHmac("sha256", salt).update(source).digest("hex");
  const windowStart = new Date(Date.now() - 15 * 60_000);

  const recent = await prisma.enquirySubmissionAttempt.count({
    where: { fingerprint, createdAt: { gte: windowStart } },
  });
  if (recent >= 5) return false;
  await prisma.enquirySubmissionAttempt.create({ data: { fingerprint } });

  if (Math.random() < 0.02)
    await prisma.enquirySubmissionAttempt.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60_000) } },
    });
  return true;
}
