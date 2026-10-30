-- Adds the product catalogue and multi-product quotation enquiry workflow.
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'QUOTATION_SENT', 'NEGOTIATION', 'WON', 'LOST');

CREATE TABLE "products" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "brand" TEXT,
  "description" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "is_available" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enquiries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "customer_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "location" TEXT NOT NULL,
  "pin_code" TEXT NOT NULL,
  "preferred_date" DATE,
  "instructions" TEXT,
  "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enquiry_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "enquiry_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "product_name" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unit" TEXT NOT NULL,
  CONSTRAINT "enquiry_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE UNIQUE INDEX "enquiries_reference_key" ON "enquiries"("reference");
CREATE INDEX "enquiries_status_created_at_idx" ON "enquiries"("status", "created_at" DESC);
CREATE INDEX "enquiry_items_enquiry_id_idx" ON "enquiry_items"("enquiry_id");
CREATE INDEX "enquiry_items_product_id_idx" ON "enquiry_items"("product_id");

ALTER TABLE "enquiry_items" ADD CONSTRAINT "enquiry_items_enquiry_id_fkey"
FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enquiry_items" ADD CONSTRAINT "enquiry_items_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
