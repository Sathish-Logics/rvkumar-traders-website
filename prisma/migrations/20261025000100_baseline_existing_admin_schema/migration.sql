-- Prisma baseline for the existing public admin schema.
--
-- Prisma is the single source of truth for the application database schema.
-- Supabase continues to provide the PostgreSQL host and Auth schema.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "app_role" AS ENUM ('owner', 'manager', 'sales', 'operations', 'accounts');

CREATE TABLE "admin_profiles" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "role" "app_role" NOT NULL DEFAULT 'owner',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_seen_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_type" TEXT NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID,
    "before_data" JSONB,
    "after_data" JSONB,
    "reason" TEXT,
    "request_id" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_events_entity_history_idx"
ON "audit_events"("entity_type", "entity_id", "occurred_at" DESC);

CREATE INDEX "audit_events_actor_history_idx"
ON "audit_events"("actor_id", "occurred_at" DESC);

ALTER TABLE "audit_events"
ADD CONSTRAINT "audit_events_actor_id_fkey"
FOREIGN KEY ("actor_id") REFERENCES "admin_profiles"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
