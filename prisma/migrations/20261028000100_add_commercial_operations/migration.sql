-- Adds the private quotation-to-payment workflow. No commercial values are exposed publicly.
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'ISSUED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'SUPERSEDED');
CREATE TYPE "OrderStatus" AS ENUM ('CONFIRMED', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "DeliveryStatus" AS ENUM ('SCHEDULED', 'PREPARING', 'DISPATCHED', 'PARTIALLY_DELIVERED', 'DELIVERED', 'FAILED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'OTHER');
CREATE TYPE "PaymentStatus" AS ENUM ('RECORDED', 'REVERSED');
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

CREATE TABLE "quotations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "enquiry_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
  "transportation_charge" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "tax_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "grand_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "valid_until" DATE,
  "payment_terms" TEXT,
  "delivery_terms" TEXT,
  "notes" TEXT,
  "issued_at" TIMESTAMPTZ(6),
  "accepted_at" TIMESTAMPTZ(6),
  "created_by_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quotations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quotations_nonnegative_totals" CHECK ("transportation_charge" >= 0 AND "discount_amount" >= 0 AND "subtotal" >= 0 AND "tax_total" >= 0 AND "grand_total" >= 0)
);

CREATE TABLE "quotation_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "quotation_id" UUID NOT NULL,
  "product_id" UUID,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unit" TEXT NOT NULL,
  "unit_rate" DECIMAL(14,2) NOT NULL,
  "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "taxable" DECIMAL(14,2) NOT NULL,
  "tax_amount" DECIMAL(14,2) NOT NULL,
  "line_total" DECIMAL(14,2) NOT NULL,
  CONSTRAINT "quotation_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quotation_items_valid_amounts" CHECK ("quantity" > 0 AND "unit_rate" >= 0 AND "tax_rate" >= 0 AND "tax_rate" <= 100 AND "taxable" >= 0 AND "tax_amount" >= 0 AND "line_total" >= 0)
);

CREATE TABLE "orders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "quotation_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'CONFIRMED',
  "total_amount" DECIMAL(14,2) NOT NULL,
  "address" TEXT NOT NULL,
  "pin_code" TEXT NOT NULL,
  "cancelled_at" TIMESTAMPTZ(6),
  "cancel_reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "orders_nonnegative_total" CHECK ("total_amount" >= 0)
);

CREATE TABLE "deliveries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "order_id" UUID NOT NULL,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'SCHEDULED',
  "scheduled_date" DATE NOT NULL,
  "address" TEXT NOT NULL,
  "vehicle_number" TEXT,
  "driver_name" TEXT,
  "driver_phone" TEXT,
  "notes" TEXT,
  "proof_path" TEXT,
  "delivered_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "order_id" UUID NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'RECORDED',
  "received_at" TIMESTAMPTZ(6) NOT NULL,
  "external_ref" TEXT,
  "note" TEXT,
  "recorded_by_id" UUID NOT NULL,
  "reversed_at" TIMESTAMPTZ(6),
  "reversal_reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payments_positive_amount" CHECK ("amount" > 0)
);

CREATE TABLE "notification_outbox" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "channel" "NotificationChannel" NOT NULL,
  "destination" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "next_attempt_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "provider_id" TEXT,
  "last_error" TEXT,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sent_at" TIMESTAMPTZ(6),
  CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "quotations_reference_key" ON "quotations"("reference");
CREATE UNIQUE INDEX "quotations_enquiry_id_version_key" ON "quotations"("enquiry_id", "version");
CREATE INDEX "quotations_status_created_at_idx" ON "quotations"("status", "created_at" DESC);
CREATE INDEX "quotations_customer_id_created_at_idx" ON "quotations"("customer_id", "created_at" DESC);
CREATE INDEX "quotation_items_quotation_id_idx" ON "quotation_items"("quotation_id");
CREATE UNIQUE INDEX "orders_reference_key" ON "orders"("reference");
CREATE UNIQUE INDEX "orders_quotation_id_key" ON "orders"("quotation_id");
CREATE INDEX "orders_status_created_at_idx" ON "orders"("status", "created_at" DESC);
CREATE INDEX "orders_customer_id_created_at_idx" ON "orders"("customer_id", "created_at" DESC);
CREATE UNIQUE INDEX "deliveries_reference_key" ON "deliveries"("reference");
CREATE INDEX "deliveries_status_scheduled_date_idx" ON "deliveries"("status", "scheduled_date");
CREATE INDEX "deliveries_order_id_idx" ON "deliveries"("order_id");
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");
CREATE INDEX "payments_order_id_received_at_idx" ON "payments"("order_id", "received_at" DESC);
CREATE UNIQUE INDEX "notification_outbox_idempotency_key_key" ON "notification_outbox"("idempotency_key");
CREATE INDEX "notification_outbox_status_next_attempt_at_idx" ON "notification_outbox"("status", "next_attempt_at");

ALTER TABLE "quotations" ADD CONSTRAINT "quotations_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quotations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quotation_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "deliveries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notification_outbox" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "quotations", "quotation_items", "orders", "deliveries", "payments", "notification_outbox" FROM anon, authenticated;
