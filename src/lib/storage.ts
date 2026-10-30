// Creates short-lived owner-only upload URLs for private proof-of-delivery files.
import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export async function createProofUpload(deliveryId: string, extension: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Supabase Storage is not configured");
  const safeExtension = ["jpg", "jpeg", "png", "webp", "pdf"].includes(extension)
    ? extension
    : "jpg";
  const path = `${deliveryId}/${randomUUID()}.${safeExtension}`;
  const client = createClient(url, secret, { auth: { persistSession: false } });
  const { data, error } = await client.storage
    .from("delivery-proofs")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { path, token: data.token, signedUrl: data.signedUrl };
}
