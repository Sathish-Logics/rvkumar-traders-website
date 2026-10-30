# RVKumar Traders Website and Operations Platform

Mobile-first construction-materials website and business operations platform for RVKumar Traders.

## Current build status

The Vite starter has been migrated to Next.js. The first implemented increment includes:

- Responsive public homepage.
- Approved navy and construction-orange visual system.
- Product-range, process, delivery-area, quotation-preview, FAQ, and footer sections.
- Local Manrope and Inter variable fonts.
- SEO metadata, Open Graph metadata, robots route, and sitemap route.
- Placeholder privacy and terms pages.
- Disabled/unlinked contact actions until verified business contact details are supplied.

The backend foundation now includes Supabase Auth and Storage integration, Prisma database
access, owner-only server authorization, a protected dashboard shell, and versioned SQL migrations.
The backend now covers customer CRM, quotation versions and PDFs, accepted-quotation order
conversion, deliveries, manual payments, reporting, notification queues and audit history.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and Docker for the local Supabase stack.

```bash
npm install
npm run supabase:start
cp .env.example .env.local
npm run db:reset
npm run dev
```

Open the application at `http://localhost:3000` and local Supabase Studio at
`http://127.0.0.1:54323`.

Run `npm run supabase:status` to view local connection details. Copy the local API URL,
publishable key and secret key into `.env.local`; never commit those values. Use
`npm run supabase:stop` when the local services are no longer needed.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local`. Do not commit real secret values. Variables prefixed with `NEXT_PUBLIC_` are intentionally browser-visible and must never contain secrets.

For admin authentication, create a Supabase project and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` only when a server-only operation genuinely requires it
- `DATABASE_URL` for Prisma application queries
- `DIRECT_URL` for Prisma migrations

For local development, `npm run db:reset` resets the local Supabase services, deploys every
Prisma migration, loads the deterministic product seed and regenerates the Prisma client. For
hosted Supabase, configure `DIRECT_URL`, then run `npm run db:migrate:deploy` followed by
`npm run db:seed`. Create the owner in Supabase Auth, then insert the matching user UUID into
`public.admin_profiles` with the `owner` role. The application intentionally provides no public
admin-registration flow.

Supabase owns authentication, storage and database hosting. Prisma owns typed access,
versioned migrations, RLS/grant hardening and seed data for the public application schema. Do
not introspect or migrate the Supabase-managed `auth` and `storage` schemas through Prisma.

Create a private Supabase Storage bucket named `delivery-proofs`. For optional notifications,
configure the Resend, Twilio, owner-recipient and `CRON_SECRET` values documented in
`.env.example`, then schedule `POST /api/cron/notifications` with a bearer token. Until real
provider credentials are added, business records still save normally and notifications remain
disabled or queued. `ADMIN_AUTH_BYPASS` must remain false in production.

## Documentation

- `docs/PRD.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/DATABASE_ERD.md`
- `docs/AUTHORIZATION_MATRIX.md`
- `docs/API_SERVICE_CONTRACTS.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

## Pre-launch blockers

- Verified business phone, WhatsApp number, and email.
- Complete legal address, GSTIN, and business hours.
- Final product spellings, classifications, specifications, and units.
- Approved logo, photographs, privacy notice, and business terms.
- Production site URL and selected service providers.
