-- Completes the Supabase Auth relationship and server-side authorization rules.
-- Statements are idempotent so databases created before Prisma consolidation
-- can safely apply this migration.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE contype = 'f'
      AND conrelid = 'public.admin_profiles'::regclass
      AND confrelid = 'auth.users'::regclass
  ) THEN
    ALTER TABLE public.admin_profiles
      ADD CONSTRAINT admin_profiles_auth_user_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id)
      ON DELETE RESTRICT;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_profiles_display_name_check'
  ) THEN
    ALTER TABLE public.admin_profiles
      ADD CONSTRAINT admin_profiles_display_name_check
      CHECK (char_length(trim(display_name)) BETWEEN 2 AND 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audit_events_actor_type_check'
  ) THEN
    ALTER TABLE public.audit_events
      ADD CONSTRAINT audit_events_actor_type_check
      CHECK (actor_type IN ('admin', 'system', 'public', 'provider'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audit_events_action_check'
  ) THEN
    ALTER TABLE public.audit_events
      ADD CONSTRAINT audit_events_action_check
      CHECK (char_length(action) BETWEEN 3 AND 120);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audit_events_entity_type_check'
  ) THEN
    ALTER TABLE public.audit_events
      ADD CONSTRAINT audit_events_entity_type_check
      CHECK (char_length(entity_type) BETWEEN 2 AND 80);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = (SELECT auth.uid())
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.admin_profiles FROM anon, authenticated;
REVOKE ALL ON TABLE public.audit_events FROM anon, authenticated;
GRANT SELECT ON TABLE public.admin_profiles TO authenticated;
GRANT SELECT ON TABLE public.audit_events TO authenticated;

DROP POLICY IF EXISTS "active admin reads own profile" ON public.admin_profiles;
CREATE POLICY "active admin reads own profile"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()) AND is_active = true);

DROP POLICY IF EXISTS "active owner reads audit events" ON public.audit_events;
CREATE POLICY "active owner reads audit events"
  ON public.audit_events
  FOR SELECT
  TO authenticated
  USING (
    public.is_active_admin()
    AND EXISTS (
      SELECT 1
      FROM public.admin_profiles
      WHERE id = (SELECT auth.uid())
        AND role = 'owner'
    )
  );

COMMENT ON TABLE public.audit_events IS
  'Append-only security and business audit history. Application roles have no update or delete grant.';
