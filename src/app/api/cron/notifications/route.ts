// Processes queued email/SMS notifications when called by a trusted scheduler.
import { NextResponse } from "next/server";
import { processNotificationOutbox } from "@/lib/notifications";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await processNotificationOutbox());
}
