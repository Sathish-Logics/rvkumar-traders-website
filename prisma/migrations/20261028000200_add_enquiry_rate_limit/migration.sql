-- Persists privacy-safe enquiry submission fingerprints for multi-instance rate limiting.
CREATE TABLE "enquiry_submission_attempts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "fingerprint" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "enquiry_submission_attempts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "enquiry_submission_attempts_fingerprint_created_at_idx" ON "enquiry_submission_attempts"("fingerprint", "created_at" DESC);
ALTER TABLE "enquiry_submission_attempts" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "enquiry_submission_attempts" FROM anon, authenticated;
