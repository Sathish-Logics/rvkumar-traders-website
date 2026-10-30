-- Adds normalized customers, follow-up scheduling, and append-only enquiry activity.
CREATE TYPE "EnquiryActivityType" AS ENUM (
  'CREATED',
  'NOTE',
  'FOLLOW_UP_SET',
  'STATUS_CHANGED'
);

CREATE TABLE "customers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "customers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "customers_name_check" CHECK (char_length(trim("name")) BETWEEN 2 AND 100),
  CONSTRAINT "customers_phone_check" CHECK ("phone" ~ '^[6-9][0-9]{9}$')
);

CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
CREATE INDEX "customers_name_idx" ON "customers"("name");

ALTER TABLE "enquiries"
  ADD COLUMN "customer_id" UUID,
  ADD COLUMN "follow_up_at" TIMESTAMPTZ(6),
  ADD COLUMN "lead_source" TEXT NOT NULL DEFAULT 'website';

INSERT INTO "customers" ("name", "phone", "email", "created_at", "updated_at")
SELECT DISTINCT ON ("phone")
  "customer_name",
  "phone",
  "email",
  "created_at",
  "updated_at"
FROM "enquiries"
ORDER BY "phone", "created_at" DESC;

UPDATE "enquiries" AS enquiry
SET "customer_id" = customer."id"
FROM "customers" AS customer
WHERE customer."phone" = enquiry."phone";

ALTER TABLE "enquiries"
  ALTER COLUMN "customer_id" SET NOT NULL,
  ADD CONSTRAINT "enquiries_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "enquiries_lead_source_check"
    CHECK (char_length(trim("lead_source")) BETWEEN 2 AND 50);

CREATE INDEX "enquiries_customer_id_created_at_idx"
  ON "enquiries"("customer_id", "created_at" DESC);
CREATE INDEX "enquiries_follow_up_at_idx" ON "enquiries"("follow_up_at");

CREATE TABLE "enquiry_activities" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "enquiry_id" UUID NOT NULL,
  "actor_id" UUID,
  "type" "EnquiryActivityType" NOT NULL,
  "note" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "enquiry_activities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "enquiry_activities_note_check"
    CHECK ("note" IS NULL OR char_length(trim("note")) BETWEEN 1 AND 2000),
  CONSTRAINT "enquiry_activities_enquiry_id_fkey"
    FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "enquiry_activities_actor_id_fkey"
    FOREIGN KEY ("actor_id") REFERENCES "admin_profiles"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "enquiry_activities_enquiry_id_created_at_idx"
  ON "enquiry_activities"("enquiry_id", "created_at" DESC);
CREATE INDEX "enquiry_activities_actor_id_created_at_idx"
  ON "enquiry_activities"("actor_id", "created_at" DESC);

INSERT INTO "enquiry_activities" ("enquiry_id", "type", "note", "metadata", "created_at")
SELECT
  "id",
  'CREATED'::"EnquiryActivityType",
  'Enquiry received',
  jsonb_build_object('reference', "reference"),
  "created_at"
FROM "enquiries";

ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enquiry_activities" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "customers" FROM anon, authenticated;
REVOKE ALL ON TABLE "enquiry_activities" FROM anon, authenticated;
