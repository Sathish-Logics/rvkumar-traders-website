# Development Audit Log

This log records material repository work for the RVKumar Traders platform. It explains what changed, why it changed, how it was performed and verified, and where it occurred. It must not contain passwords, access tokens, service-role keys, or unnecessary customer information.

## 24 October 2026 — Product definition initiated

### What changed

- Added the initial Product Requirements Document.
- Recorded the agreed business identity, location context, product list, MVP scope, user journeys, sitemap, design direction, SEO requirements, security expectations, audit requirements, and staged delivery plan.
- Recorded unresolved business information as explicit launch dependencies rather than inventing values.

### Why

The owner requested that planning precede production implementation and that work proceed one stage at a time. A written PRD establishes a reviewable source of truth and reduces accidental scope expansion.

### How

- Inspected the current repository structure and active application entry point.
- Confirmed that the repository contains the default Vite React starter rather than an existing business application.
- Consolidated requirements supplied during product discussion.
- Used editable placeholders where business contact and registration details are unavailable.

### Where

- `docs/PRD.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Confirmed that no application source file was edited during this phase.
- Confirmed that public pricing is explicitly prohibited in the PRD.
- Confirmed that an enquiry, quotation, order, delivery, and payment remain separate business records.
- Confirmed that development and in-application audit requirements are both documented.

### Decisions and limitations

- The future application will replace the Vite starter with Next.js after technical-design approval.
- No deployment, dependency installation, schema creation, or application implementation was performed in this phase.
- Product spellings and classifications remain owner-review items.

## 24 October 2026 — Technical design completed

### What changed

- Added the proposed modular Next.js architecture and repository boundaries.
- Added a logical database ERD and detailed entity responsibilities.
- Added owner and future-role authorization rules.
- Added public HTTP and internal service contracts.
- Defined enquiry reliability, quotation calculation, workflow transitions, notification outbox, audit events, concurrency, storage, SEO rendering, backup, observability, and testing boundaries.

### Why

The implementation needs explicit business and security rules before database migrations or application code are created. This prevents accidental coupling, public price exposure, invalid workflow transitions, history loss, and authorization based only on the user interface.

### How

- Translated the approved PRD into bounded domain modules.
- Modelled enquiries, leads, customers, quotations, orders, deliveries, and payments as distinct records.
- Specified immutable issued quotation versions and append-only audit events.
- Designed provider-independent notifications and transactional outbox behavior.
- Defined server-authoritative validation, authorization, calculations, and state transitions.

### Where

- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/DATABASE_ERD.md`
- `docs/AUTHORIZATION_MATRIX.md`
- `docs/API_SERVICE_CONTRACTS.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Cross-checked domain names and lifecycle stages against `docs/PRD.md`.
- Confirmed that public catalogue contracts omit pricing and internal notes.
- Confirmed that an enquiry cannot automatically create an order.
- Confirmed that owner authorization is sufficient for the MVP while future roles remain possible.
- Confirmed that notification failure cannot roll back a stored enquiry.
- Confirmed that important mutations have defined audit-event behavior.

### Decisions and limitations

- These are implementation contracts, not SQL migrations or executable APIs yet.
- Email, SMS, PDF, analytics, job scheduling, backup tier, and authentication-mode providers remain implementation selections.
- Exact product units, classifications, tax codes, GSTIN, and retention periods still require owner confirmation.
- No application source, dependencies, deployment configuration, or database was changed in this phase.

## 24 October 2026 — Next.js foundation and public homepage

### What changed

- Replaced the default Vite React starter with a Next.js App Router application.
- Added a responsive public homepage using the approved navy, orange, warm off-white, charcoal, and concrete-gray palette.
- Added local Manrope and Inter variable fonts and Lucide interface icons.
- Added homepage sections for product discovery, enquiry process, service-area guidance, quotation preview, FAQs, mobile actions, and business footer.
- Added SEO metadata, Open Graph fields, canonical metadata, `robots.txt`, and `sitemap.xml` generation.
- Added privacy and terms placeholder routes marked not to be indexed.
- Added an environment-variable template, Next.js configuration, strict TypeScript configuration, ESLint configuration, and local setup documentation.
- Removed obsolete Vite entry points and configuration.

### Why

The approved architecture requires Next.js for server rendering, SEO, protected admin routes, and future server-side services. The homepage is the first customer-visible increment and establishes the design system and content standards before catalogue and enquiry workflows are implemented.

### How

- Used Next.js server components for the homepage, header, and footer.
- Kept content factual and marked unresolved product classifications and legal/contact content clearly.
- Used replaceable external construction imagery during the placeholder phase.
- Disabled phone/contact behavior rather than publishing invented details.
- Kept the quotation area as a non-submitting preview until validation, persistence, privacy, rate limiting, and notification services are implemented together.
- Used responsive CSS with accessible focus states, semantic headings, native FAQ disclosure elements, 44-pixel-or-larger primary actions, and reduced-motion support.

### Where

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `.env.example`
- `.gitignore`
- `README.md`

### Verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with Next.js 16.4.3.
- The production build statically prerendered the homepage, privacy page, terms page, robots route, and sitemap route.
- Local production homepage returned HTTP 200.
- Local rendered HTML contained the business name, primary location, quotation CTA, construction-material message, and GST-registration wording.
- Generated robots and sitemap routes returned valid content.
- Dependency audit reported zero known vulnerabilities at installation time.

### Decisions and limitations

- The two external Unsplash images are temporary and must be replaced by approved business photography before launch.
- The mobile menu icon is currently informational; all navigation destinations are present on the single homepage in this increment.
- The quotation form is intentionally a disabled preview and does not collect data yet.
- Contact actions remain disabled or informational until verified phone, WhatsApp, and email values are supplied.
- Legal pages are explicit placeholders and are not production legal advice.
- Visual screenshot QA was not available in the current workspace; responsive behavior was implemented and compile/HTTP checks passed.
- Next.js 16.4.3's CLI TypeScript output capture returned an empty string in this execution environment. `experimental.useTypeScriptCli` is disabled so Next uses its supported compiler API; independent strict `tsc --noEmit` remains required and passed.

## 24 October 2026 — Image-led product catalogue refinement

### What changed

- Changed the homepage location card from “Based in Aathipatti” to “Based in Aruppukottai,” with Aathipatti and PIN code retained as the more specific locality line.
- Replaced the text-dominant product tiles with six image-led material cards.
- Added dedicated imagery for cement, TMT steel, M-Sand/P-Sand, bricks/stones, ready-mix concrete, and building/finishing essentials.
- Added descriptive alternative text for each product image.
- Added `LocalBusiness` and product `ItemList` structured data without pricing, ratings, or unsupported claims.
- Refined hover, focus, responsive crop, numbering, category icon, and card-content treatments.

### Why

The owner requested a more visually attractive product section that lets visitors recognize materials immediately while remaining minimal and SEO-friendly. Showing relevant material photography improves scanning and reduces reliance on text-only cards.

### How

- Generated six coordinated, text-free photorealistic product assets using the built-in image-generation workflow.
- Used a consistent brief: commercial construction-material photography, crop-safe landscape framing, warm industrial lighting, no people where avoidable, no brands/logos, no text, and no watermark.
- Inspected every generated image before use.
- Converted the large PNG sources to 960 × 640 WebP at quality 82 using ImageMagick.
- Reduced the six-image payload from approximately 16.7 MB of source PNGs to approximately 712 KB of WebP assets before Next.js runtime optimization.
- Moved the original generated PNG copies out of the project to `/tmp/rvkumar-product-source-pngs`; only optimized website assets remain in the repository.
- Continued using semantic product names and descriptive copy in HTML so essential content does not depend on image recognition.

### Where

- `app/page.tsx`
- `app/globals.css`
- `public/images/products/cement.webp`
- `public/images/products/tmt-steel.webp`
- `public/images/products/sand.webp`
- `public/images/products/bricks-stones.webp`
- `public/images/products/ready-mix-concrete.webp`
- `public/images/products/build-essentials.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Inspected all six generated source images and representative optimized WebP outputs.
- Confirmed all WebP assets are 960 × 640 and individually between approximately 60 KB and 164 KB.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

## 24 October 2026 — Product-image cache invalidation

### What changed

- Assigned new versioned filenames to the five owner-supplied catalogue images.
- Updated the homepage image references for cement, TMT steel, sand, brickwork and earthmoving services.

### Why

The development screenshot showed Next.js returning HTTP 304 responses for previously optimized image URLs. Because the replacement assets reused the same filenames, the browser and image optimizer continued displaying older cached output.

### How

- Created `owner-v2` asset filenames so each image has a new URL.
- Preserved the optimized 960 × 640 WebP format.
- Rebuilt the application after updating all consuming references.

### Where

- `app/page.tsx`
- `public/images/products/ultratech-cement-owner-v2.webp`
- `public/images/products/tmt-steel-owner-v2.webp`
- `public/images/products/sand-owner-v2.webp`
- `public/images/products/brickwork-owner-v2.webp`
- `public/images/products/earthmover-owner-v2.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Confirmed all five versioned WebP assets are 960 × 640.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

## 24 October 2026 — English-first generated material visuals

### What changed

- Replaced the four downloaded placeholder images for gravel, crushed stone, lime and waterproofing with a coordinated premium generated image set.
- Added separate catalogue cards titled `Gravel (Keraval)`, `Crushed Stone Aggregate`, `Construction Lime` and `Waterproofing Materials`.
- Kept the familiar local terms Keraval, Sali Kaal and Chunambu in secondary copy while making every primary product name understandable in English.
- Removed numbered and icon overlays so the material images remain unobstructed.
- Restored the larger two-column editorial card layout with a wide JCB feature card.

### Why

The owner requested imagery that communicates each unfamiliar material visually and a more polished, interactive presentation without using the supplied reference images.

### How

- Generated four original 1536 × 1024 photorealistic construction-material scenes using the built-in image-generation workflow.
- Used distinct visual treatments: warm gravel, angular dark crushed aggregate, white construction lime with sack and trowel, and an applied waterproof membrane with visible water beading.
- Avoided brands, text, logos, people and watermarks inside the generated assets.
- Cropped and optimized final files to 1200 × 800 WebP at quality 84.
- Updated visible copy, alternative text and schema descriptions without adding public prices.

### Where

- `app/page.tsx`
- `app/globals.css`
- `public/images/products/keraval-gravel.webp`
- `public/images/products/sali-kaal.webp`
- `public/images/products/chunambu.webp`
- `public/images/products/waterproofing.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Confirmed all four generated WebP assets are 1200 × 800.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

### Decisions and limitations

- Generated images are polished temporary assets, not photographs of RVKumar Traders’ actual stock or premises.
- Images intentionally contain no product logos or readable packaging claims. Brand names remain factual HTML text supplied by the owner.
- These assets should be replaced with approved real business photographs when available.
- Product cards still lead to the quotation preview until the working enquiry flow is implemented.

## 24 October 2026 — Branded product imagery and JCB service

### What changed

- Replaced the temporary cement image with an official UltraTech Cement product pack image.
- Replaced the temporary TMT image with an official Agni Fe 550D steel image while retaining TSRM Steel in the available-brand copy.
- Replaced the generic build-essentials image with an official Roff Vitrofix tile-adhesive product pack image.
- Added JCB Services as a new enquiry category for earthmoving, excavation and site work, using an official JCB 3DX image.
- Updated visible product names, image alternative text and structured data to identify the displayed brands and classify JCB as a service.
- Presented the JCB service as a full-width feature card on desktop and retained a single-column mobile layout.

### Why

The owner requested recognizable real-world brand and product imagery rather than text-only or generic product presentation, and specifically requested JCB service to be included.

### How

- Downloaded source imagery from the official UltraTech Cement, Agni Steels, Pidilite Roff and JCB product pages.
- Stored local copies instead of hotlinking remote image files.
- Normalized each asset to 960 × 640 WebP for consistent card rendering and lower transfer size.
- Used contain-fit presentation for transparent product packs and cover-fit presentation for steel and machinery photography.
- Kept all commercial information behind the enquiry workflow; no prices were introduced.

### Where

- `app/page.tsx`
- `app/globals.css`
- `public/images/products/ultratech-cement.webp`
- `public/images/products/agni-tmt-steel.webp`
- `public/images/products/roff-tile-adhesive.webp`
- `public/images/products/jcb-3dx.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Image sources

- UltraTech Cement official product page: `https://www.ultratechcement.com/tamil/for-homebuilders/products`
- Agni Steels official products page: `https://agnisteels.com/products/`
- Pidilite Roff official brand page: `https://www.pidilite.com/consumer-brands/roff`
- JCB official 3DX page: `https://www.jcb.com/en-IN/products/machines/backhoe-loaders/3dx/`

### Verification

- Confirmed all four new WebP assets are 960 × 640.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

### Decisions and limitations

- Brand imagery represents the named products and services; it is not photography of RVKumar Traders' current physical inventory.
- TSRM Steel remains in text but does not yet have its own approved image asset.
- Chunambu and waterproofing oil remain within the build-essentials category; their individual brand imagery can be replaced later.

## 24 October 2026 — Owner-selected catalogue images and compact cards

### What changed

- Replaced the cement, TMT steel, sand, bricks and earthmoving card images with the five images explicitly supplied by the owner.
- Renamed the machinery card from JCB Services to Earthmoving Services because the supplied image shows a tracked excavator.
- Reduced desktop catalogue cards from two large columns to three compact columns.
- Reduced card height, image height, content padding, heading size, corner radius and grid spacing.
- Preserved responsive two-column tablet and single-column mobile layouts.

### Why

The owner explicitly requested using the supplied images and making the product-image cards smaller.

### How

- Cropped or contained each supplied JPEG into a consistent 960 × 640 frame.
- Exported optimized local WebP assets and replaced the previous files in place.
- Updated alternative text and service metadata to match the visible imagery.

### Where

- `app/page.tsx`
- `app/globals.css`
- `public/images/products/ultratech-cement.webp`
- `public/images/products/agni-tmt-steel.webp`
- `public/images/products/sand.webp`
- `public/images/products/bricks-stones.webp`
- `public/images/products/jcb-3dx.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Confirmed all five replacement WebP assets are 960 × 640.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

## 24 October 2026 — Lime, essentials and bricks image correction

### What changed

- Replaced the Construction Lime image with a tighter product-focused sack, lime powder and masonry-trowel composition.
- Replaced the Build Essentials pack shot with a complete tile adhesive, tile, waterproofing and application-tools scene.
- Restored Bricks & Stones to a clean material-only composition without hands or active masonry work.
- Used new `v3` filenames so Next.js image optimization and browser caches load the replacements immediately.

### Why

The owner requested different imagery for Construction Lime and Build Essentials and asked for the previous product-focused bricks presentation to return.

### How

- Generated three original landscape product images with the built-in image-generation workflow.
- Cropped and optimized each asset to 960 × 640 WebP at quality 84.
- Updated image paths, alternative text and brand metadata while retaining the compact card layout.

### Where

- `app/page.tsx`
- `public/images/products/construction-lime-v3.webp`
- `public/images/products/build-essentials-v3.webp`
- `public/images/products/bricks-stones-restored-v3.webp`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Confirmed all three new WebP assets are 960 × 640.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and statically prerendered all public routes.

## 24 October 2026 — Admin authentication and backend foundation

### What changed

- Installed the Supabase SSR client, Supabase JavaScript SDK, Zod and the server-only import guard.
- Added validated browser-safe Supabase environment configuration.
- Added separate browser and server Supabase client factories.
- Added a Next.js 16 proxy that refreshes authentication claims and session cookies.
- Added an owner-only admin login page using an email/password server action.
- Added server-side authorization that requires both a valid Supabase user and an active owner profile.
- Added a protected admin layout, sign-out action and initial operational-dashboard shell.
- Added the first SQL migration for admin profiles, owner-role authorization, Row Level Security and append-only audit events.
- Updated the environment template and setup documentation.

### Why

The admin and operational modules require a secure identity, authorization and database foundation before any customer, enquiry, quotation or payment data is exposed.

### How

- Authentication sessions use Supabase SSR cookies; protected pages do not trust client-side state.
- The protected layout calls `requireActiveAdmin()` on the server for every admin render.
- Authorization checks an active `admin_profiles` record and restricts the MVP to the `owner` role.
- The migration enables RLS, revokes anonymous and authenticated default table privileges, and grants only the minimum read access required for the owner check and audit review.
- Audit-event update and delete privileges are never granted to application roles.
- Admin registration is intentionally absent; the first owner must be created through trusted Supabase administration and linked to an admin profile.
- The server secret variable is documented but not used or exposed to the browser in this increment.

### Where

- `app/admin/login/page.tsx`
- `app/admin/login/actions.ts`
- `app/admin/(protected)/layout.tsx`
- `app/admin/(protected)/page.tsx`
- `app/admin/(protected)/actions.ts`
- `lib/env.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/auth/require-admin.ts`
- `proxy.ts`
- `supabase/migrations/202610240001_admin_foundation.sql`
- `app/globals.css`
- `.env.example`
- `README.md`
- `package.json`
- `package-lock.json`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- `npx next typegen` regenerated route types after adding `/admin`.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- The production build exposes `/admin` and `/admin/login` as dynamic server-rendered routes.
- Public website and legal routes remain statically prerendered.
- The Next.js authentication proxy is included in the production build.
- Dependency installation reported zero known vulnerabilities.

### Decisions and limitations

- At this stage the migration had been created but had not yet been applied; the later local-initialization entry records its successful local application. Hosted deployment still requires a linked Supabase project.
- Login cannot complete until the Supabase URL, publishable key, Auth owner account and matching active `admin_profiles` row exist.
- MFA is designed as a follow-up hardening step after the initial owner account is connected.
- Dashboard values intentionally show unavailable states until operational tables and queries are implemented.

## 24 October 2026 — Standard local Supabase initialization

### What changed

- Installed Supabase CLI `2.122.0` as a project development dependency.
- Initialized the repository with the standard Supabase project configuration.
- Preserved and applied the existing admin-foundation migration.
- Added a tracked seed entry point and npm scripts for starting, stopping, inspecting and resetting the local database.
- Disabled local public sign-up and strengthened the local password policy to match the owner-only admin model.
- Documented the repeatable local and hosted database workflows.

### Why

Keeping the CLI, configuration, migrations and seed entry point in version control makes every development and deployment environment reproducible. A clean reset also proves that the schema can be created from the repository alone instead of depending on undocumented dashboard changes.

### How

- Ran `supabase init` to generate `supabase/config.toml` and Supabase-local ignore rules.
- The first sandboxed initialization attempt could not create the CLI user cache under the home directory; it was rerun with approved system access and completed normally.
- Started the official local Supabase Docker stack and downloaded its service images.
- Ran `supabase db reset`, which recreated PostgreSQL and applied `202610240001_admin_foundation.sql` from a clean state.
- Added `supabase/seed.sql` so future resets have an explicit, deterministic seed location without fabricating an owner UUID.
- Added package scripts that use the repository-local CLI version.

### Where

- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/.gitignore`
- `supabase/migrations/202610240001_admin_foundation.sql`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Local Supabase database, API, Auth, Studio, Storage and email-testing services started successfully.
- `supabase db reset` completed with exit code 0 and applied the admin-foundation migration.
- The migration remains the version-controlled source of truth; no schema was created manually in Studio.

### Decisions and limitations

- Local keys remain local development credentials and are not written to committed environment files.
- The owner account is not seeded because its profile UUID must match a real Supabase Auth user created through trusted administration.
- Optional image-proxy, edge-runtime and connection-pooler services are not required for this increment.

## 25 October 2026 — Local owner account provisioning

### What changed

- Created a confirmed local Supabase Auth user for `v.sathishblack@gmail.com`.
- Added the matching active `owner` record with display name `V. Sathish`.
- Added a system audit event recording the local owner provisioning action.
- Enabled the local email authentication provider while retaining the global public-signup block.

### Why

The owner needs a working local account to test the protected administration application. Email authentication must remain enabled for an existing owner to sign in; global `auth.enable_signup = false` continues to prevent public self-registration.

### How

- Used the server-only local Supabase secret through the Admin API to create the confirmed Auth user.
- Reused the Auth UUID as the primary key of `public.admin_profiles` and assigned the `owner` role.
- Generated a strong temporary password for direct handoff to the owner; the password was not saved in tracked source or documentation.
- Inserted an append-only `audit_events` record with actor type `system`, the affected profile UUID and the provisioning reason.

### Where

- Local Supabase Auth database
- `public.admin_profiles`
- `public.audit_events`
- `supabase/config.toml`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Security

- Public self-registration remains disabled globally.
- The temporary password is not stored in the repository.
- The local account is development data and will not automatically exist in the hosted production project.

### Verification

- Email/password authentication succeeded for the local owner.
- The authenticated session could read only its matching active `owner` profile through RLS.
- The owner could read the provisioning audit event permitted by the owner audit policy.

## 25 October 2026 — Prisma and `src` architecture migration

### What changed

- Relocated the Next.js application, shared components, libraries and proxy under `src/`.
- Updated the TypeScript `@/` alias to resolve from `src/`.
- Installed Prisma Client, Prisma CLI, the PostgreSQL driver adapter, `pg`, PostgreSQL types and `dotenv`.
- Added a Prisma 7 configuration, schema, generated typed client and singleton server-only database client.
- Modeled the existing `admin_profiles`, `audit_events` and `app_role` public database objects.
- Added a Prisma baseline migration and registered it as applied against the existing local schema.
- Changed the secure admin-profile authorization query from Supabase Data API access to Prisma.
- Added empty service, validator and type module roots for the next domain implementation.
- Added Prisma development, validation, generation, introspection, baseline and deployment scripts.
- Updated environment templates, reset workflow, README and technical architecture documentation.

### Why

The owner requested the supplied single-application architecture with application code under `src/`, Prisma as the PostgreSQL data-access and migration layer, and clear separation among routes, components, services, validators and types.

### How

- Preserved Supabase for authentication, session refresh, storage, local infrastructure, RLS and grants.
- Scoped Prisma to public business tables so it does not manage Supabase's internal `auth` or `storage` schemas.
- Used Prisma's PostgreSQL driver adapter and separate runtime/direct database URLs.
- Created a baseline migration for objects already created by the Supabase foundation SQL and marked it applied rather than recreating live tables.
- Kept the Supabase foundation migration because its cross-schema Auth foreign key, RLS policies and grants cannot be represented completely in Prisma schema syntax.
- Moved the stale pre-migration `.next/dev` cache to `/tmp/rvkumar-next-dev-before-src-migration` before regenerating route types.

### Where

- `src/app/`
- `src/components/`
- `src/lib/`
- `src/services/`
- `src/validators/`
- `src/types/`
- `src/proxy.ts`
- `src/generated/prisma/`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `.env.example`
- `.env.local` (git ignored)
- `README.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Prisma schema validation passed.
- Prisma Client 7.10.1 generated successfully.
- Prisma migration status reports the database schema is up to date.
- ESLint passed.
- Next.js route types regenerated successfully from `src/app`.
- TypeScript type checking passed.
- The production build passed and recognized all public, legal and admin routes plus `src/proxy.ts`.
- Dependency installation reported zero known vulnerabilities.

### Decisions and limitations

- Prisma 8 was still a release candidate, so the stable Prisma 7.10.1 release was selected.
- The current migration is a transition baseline; future business-schema changes are created through Prisma migrations.
- Supabase-specific security SQL remains version-controlled under `supabase/migrations`.

## 25 October 2026 — Source-tree cleanup and file responsibility comments

### What changed

- Changed Prisma Client generation from `src/generated/prisma` to the standard `@prisma/client` package location.
- Removed generated Prisma internals from `src/`.
- Removed unused Vite starter assets that were not referenced by the Next.js application.
- Added a concise responsibility comment to every authored TypeScript, TSX, CSS, Prisma and configuration source file.
- Replaced empty placeholder files with README files explaining the services, validators and types layers.
- Added `src/README.md` with a compact application source map.

### Why

The owner reported that the source tree still looked messy and requested an explanation at the beginning of each file. Generated Prisma internals obscured the business code and should not be treated as authored application files.

### How

- Switched the Prisma generator to `prisma-client-js` and updated application imports to `@prisma/client`.
- Regenerated Prisma Client into the dependency package cache.
- Removed only reproducible generated files and confirmed the old Vite images had no imports before removing them.
- Kept file comments short and focused on each file's single responsibility.
- Excluded framework-generated declarations, third-party dependencies, JSON files and generated outputs from manual comments because they are either not comment-capable or are overwritten automatically.

### Where

- `src/README.md`
- `src/app/`
- `src/components/`
- `src/lib/`
- `src/services/README.md`
- `src/validators/README.md`
- `src/types/README.md`
- `src/proxy.ts`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `next.config.ts`
- `eslint.config.mjs`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Removed

- `src/generated/prisma/` — reproducible Prisma output, now generated under `node_modules/@prisma/client`.
- `src/assets/` — unused Vite starter assets; public product assets remain under `public/images/products`.

Both removed directories are reproducible or unused and contain no customer or operational data.

### Verification

- Confirmed `src/` contains only authored application files and layer README files.
- Confirmed every authored TypeScript, TSX, CSS, Prisma and JavaScript configuration file starts with a responsibility comment.
- Prisma schema validation and client generation passed.
- Next.js route type generation passed.
- TypeScript type checking passed.
- ESLint passed.
- Production build passed with all existing public and admin routes preserved.

## 25 October 2026 — Complete requested application structure and enquiry foundation

### What changed

- Added public product listing, dynamic product detail, quotation enquiry and contact pages.
- Added direct admin layout, dashboard, enquiry-management and product-management pages.
- Removed the temporary `admin/(protected)` route-group files.
- Added public/protected enquiry Route Handlers and public/protected product Route Handlers.
- Added reusable `Header`, `Footer`, `ProductCard`, `EnquiryForm`, admin `Sidebar` and `EnquiryTable` components.
- Added Prisma-backed product and enquiry services, Zod validators, shared enquiry types and a notification adapter boundary.
- Added Product, Enquiry and EnquiryItem Prisma models plus enquiry workflow status values.
- Added and deployed the catalogue/enquiry Prisma migration.
- Added ten current materials to the local database and made the seed workflow repeatable.
- Added `tests/enquiry.test.ts` and the Vitest test runner.
- Added an explicitly temporary editable `public/logo.svg` until the approved logo is supplied.
- Added responsive catalogue, product, enquiry, contact and admin-table styles.

### Why

The previous migration created only the foundation and did not match the complete file and folder structure explicitly supplied by the owner. This change implements every named route, component, service, validator, type, migration and test path as working code.

### How

- Public pages read published product records through `product.service.ts` and Prisma.
- The enquiry form submits multiple selected materials to `POST /api/enquiries`.
- The Route Handler validates input with Zod and delegates business rules to `enquiry.service.ts`.
- The service validates product availability, creates the enquiry and line items in one transaction, appends an audit event, then invokes the notification boundary after commit.
- Admin pages and mutation endpoints perform server-side owner authorization.
- Product deletion is implemented as publication/availability disabling rather than destructive record deletion.
- Supabase seeding was disabled before Prisma migrations; `db:reset` now applies Prisma migrations first and executes the product seed afterward.

### Where

- `src/app/products/`
- `src/app/enquiry/`
- `src/app/contact/`
- `src/app/admin/`
- `src/app/api/enquiries/`
- `src/app/api/products/`
- `src/components/`
- `src/components/admin/`
- `src/lib/auth.ts`
- `src/lib/notifications.ts`
- `src/services/`
- `src/validators/`
- `src/types/`
- `prisma/schema.prisma`
- `prisma/migrations/20261025000200_add_catalogue_and_enquiries/migration.sql`
- `supabase/seed.sql`
- `tests/enquiry.test.ts`
- `public/logo.svg`
- `package.json`
- `package-lock.json`

### Verification

- Prisma schema validation and client generation passed.
- The new Prisma migration deployed successfully.
- Ten product records were seeded successfully.
- Three enquiry validation tests passed.
- TypeScript type checking passed.
- ESLint passed.
- The production build passed with every requested public, admin and API route recognized.
- `/products` returned HTTP 200.
- `/enquiry` returned HTTP 200.
- Unauthenticated `/admin` returned the expected HTTP 307 redirect to `/admin/login`.
- `/api/products` returned all ten seeded products.
- A labeled local verification enquiry was saved with HTTP 201 and reference `ENQ-20261025-8165F9`.
- Dependency installation reported zero known vulnerabilities.

### Limitations

- Notification delivery remains inactive until verified business email/SMS provider credentials and recipients are supplied.
- Product create/edit UI controls are not yet built; the protected APIs and database-backed management list are ready.
- The local verification enquiry is clearly labeled `Architecture Test` demo data.

## 25 October 2026 — Enforced readable line-by-line source formatting

### What changed

- Installed Prettier and added permanent `format` and `format:check` package scripts.
- Added a repository Prettier configuration with an 88-character print width.
- Reformatted every authored TypeScript, TSX, CSS, JSON, Markdown and configuration file.
- Expanded compressed one-line JSX, tables, layouts, API handlers and style declarations into readable multi-line code.
- Added a Prettier ignore file for dependencies, build output, coverage, binary images and generated Supabase state.

### Why

The owner explicitly required normal line-by-line code formatting and reported that the compressed implementation was difficult to read and verify.

### Where

- `prettier.config.mjs`
- `.prettierignore`
- `package.json`
- Authored project files under `src/`, `tests/`, `docs/` and root configuration

### Verification

- Confirmed `src/app/admin/(protected)/actions.ts` does not exist on disk; its visible editor tab is stale.
- Confirmed every path in the owner-supplied target structure exists on disk.
- `npm run format:check` passed.
- All three tests passed.
- TypeScript type checking passed.
- ESLint passed.
- Production build passed with all public, admin and API routes preserved.

## 25 October 2026 — Local server error diagnosis and development-server recovery

### What changed

- Connected the ignored local environment file to the running local Supabase instance.
- Changed the development command from Turbopack to Next.js Webpack mode.

### Why

The existing Turbopack development process exhausted Ubuntu's inotify file-watch allowance. It then failed to read Next.js and React package files, returned HTTP 500 for all routes and emitted misleading module-resolution errors. The application also lacked `.env.local`, so protected server operations had no Supabase connection values.

### How

- Inspected the active Next.js process and `.next/dev/logs/next-development.log`.
- Confirmed the root error was `OS file watch limit reached`, followed by secondary `Can't resolve react`, `react-dom` and `node:process` messages.
- Confirmed the previous server occupied port 3000 and returned HTTP 500 for both `/` and `/admin/login`.
- Added local-only Supabase URL and keys to the git-ignored `.env.local` file.
- Updated `npm run dev` to use `next dev --webpack`, which avoids the failing Turbopack watcher path on this machine.

### Where

- `.env.local` (git ignored)
- `package.json`
- `AGENTS.md` (generated by Next.js 16 during startup)
- `docs/DEVELOPMENT_AUDIT_LOG.md`

### Verification

- Restarted the development server on port 3000 using Next.js Webpack mode.
- `/` returned HTTP 200.
- `/admin/login` returned HTTP 200.
- Unauthenticated `/admin` returned the expected HTTP 307 redirect to `/admin/login`.
- The restarted server log contains successful requests and no file-watch or module-resolution errors.

### Security

- Local Supabase credentials remain only in `.env.local`, which is excluded by `.gitignore`.
- No local key values were added to tracked documentation or source files.

## 25 October 2026 — Consolidated Prisma and Supabase database ownership

### What changed

- Made `prisma/migrations/` the only application schema migration location.
- Moved deterministic product seed data from `supabase/seed.sql` to `prisma/seed.sql`.
- Added a Prisma authorization-hardening migration for the Supabase Auth foreign key, validation constraints, row-level security policies and grants.
- Disabled Supabase CLI application migrations and seeding in `supabase/config.toml`.
- Updated database scripts to deploy Prisma migrations and execute the Prisma-owned seed file after a local Supabase reset.
- Removed obsolete Supabase migration, seed, temporary-state and empty placeholder directories.
- Removed the empty `src/app/admin/(protected)/` route-group directory.
- Added ignore rules for Supabase CLI state and TypeScript build metadata.

### Why

The project had two competing application schema histories under `prisma/migrations/` and `supabase/migrations/`. This made initialization order unclear and could allow the same tables to be managed twice. Supabase remains the PostgreSQL, Auth and Storage platform, while Prisma now exclusively owns the public application schema.

### Where

- `prisma/migrations/20261025000300_harden_admin_authorization/migration.sql`
- `prisma/seed.sql`
- `prisma/migrations/20261025000100_baseline_existing_admin_schema/migration.sql`
- `supabase/config.toml`
- `package.json`
- `.gitignore`
- Removed: `supabase/migrations/`, `supabase/seed.sql`, generated Supabase CLI state and the empty protected route group

### Database lifecycle after cleanup

1. Supabase CLI initializes local PostgreSQL, Auth, Storage and Studio.
2. Prisma deploys the public application schema from `prisma/migrations/`.
3. Prisma executes deterministic catalogue data from `prisma/seed.sql`.
4. Supabase Auth owner accounts remain separately managed because their profile UUID must match `auth.users.id`.

### Verification

- Prisma schema validation passed.
- The authorization-hardening migration deployed successfully to the local Supabase PostgreSQL database.
- Prisma reports all three migrations applied and the database schema up to date.
- The relocated product seed executed successfully.
- All three automated tests passed.
- TypeScript type checking passed.
- ESLint passed.
- The production build passed with all public, admin, API, robots and sitemap routes preserved.
- Prettier formatting verification passed.

## 25 October 2026 — Lightweight industrial 3D homepage treatment

### What changed

- Added a layered cement, steel and brick material stack to the homepage hero using existing optimized local images.
- Added restrained perspective, depth, lighting and shadow treatments to the hero image, location card, material ticket, product cards, delivery image and quotation preview.
- Added responsive fallbacks that remove complex perspective on tablet and mobile layouts.
- Preserved reduced-motion handling for customers who request less animation.

### Why

The owner requested a more dimensional and visually attractive customer experience without weakening SEO. The implementation uses server-rendered semantic HTML, Next.js Image and CSS rather than WebGL or a client-side 3D runtime.

### SEO and performance impact

- Existing headings, descriptive copy, internal links, structured data and image alternative text remain unchanged.
- Decorative hero material images use empty alternative text so screen readers do not receive duplicated product descriptions.
- No client component, JavaScript animation package, canvas or WebGL dependency was added.
- All decorative product images are served locally through Next.js Image with explicit responsive size hints.

## 25 October 2026 — Repository hygiene cleanup

### What changed

- Removed the obsolete Prisma baseline-resolution package script.
- Updated setup documentation to match the consolidated Prisma migration and seed workflow.
- Removed a stale ignore rule for the deleted Supabase migrations directory.
- Verified and retained the Next.js TypeScript checker compatibility override after the default CLI path failed to parse TypeScript 5.9 configuration output.
- Connected the existing SVG favicon through root metadata.
- Removed the unused shared icon sheet and superseded product-image variants.

### Why

The repository inspection found instructions and configuration left over from the previous dual-migration workflow, plus static assets that were no longer referenced by source code or seed data. Removing them makes the project structure smaller and prevents developers from following an obsolete database initialization process.

### Where

- `package.json`
- `README.md`
- `.gitignore`
- `next.config.ts`
- `src/app/layout.tsx`
- `public/`
- `public/images/products/`

### Verification

- Confirmed the remaining 11 product images are referenced by the homepage or Prisma seed data.
- All three automated tests passed.
- TypeScript type checking passed.
- ESLint passed.
- The production build passed with every route preserved.
- Prettier formatting verification passed.

## 25 October 2026 — Responsive refinement for dimensional homepage

### What changed

- Added a tablet breakpoint for section headings, hero spacing and quotation-panel sizing.
- Made hero height and location-card width fluid on mobile devices.
- Removed the decorative material stack on narrow phones to prevent overlap while retaining the main dimensional hero treatment.
- Added dedicated narrow-phone layouts for typography, cards, delivery imagery, FAQs, trust indicators and footer links.
- Added safe-area-aware spacing for the fixed mobile action bar.
- Disabled hover-only transforms on touch and coarse-pointer devices.

### Why

The owner requested stronger responsive behavior after reviewing the new dimensional design. The refinements preserve visual depth on capable screens while keeping content readable, stable and touch-friendly on smaller devices.

### Where

- `src/app/globals.css`

### SEO and accessibility impact

- No content, metadata, structured data, semantic elements or crawlable links were removed.
- Responsive behavior remains CSS-only and adds no client-side JavaScript.
- Touch users no longer receive hover transforms that can create sticky interaction states.

## 25 October 2026 — Interactive responsive 3D experience

### What changed

- Replaced the static hero visual wrapper with an interactive client component that updates CSS perspective from pointer position.
- Added independently moving depth layers for the construction image, material cards, location card, enquiry ticket, light source and perspective floor grid.
- Added pointer-responsive tilt and moving light reflections to every homepage product card.
- Added automatic floating material motion for touch devices without requiring continuous JavaScript.
- Added complete reduced-motion fallbacks that flatten transforms when requested by the operating system.

### Why

The owner requested a clearly dynamic, responsive 3D presentation rather than a design that only appeared dimensional through static shadows.

### Where

- `src/components/InteractiveHeroVisual.tsx`
- `src/components/InteractiveProductCard.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

### SEO and performance approach

- Product names, descriptions, links and meaningful image alternative text remain present in server-rendered HTML.
- Interactivity updates CSS custom properties directly and does not trigger React rerenders during pointer movement.
- `requestAnimationFrame` limits hero pointer updates to the browser paint cycle.
- No WebGL, canvas, Three.js or external animation dependency was introduced.

## 25 October 2026 — Construction poster hero background

### What changed

- Converted the owner-supplied construction poster from JPEG to an optimized local WebP asset.
- Added the poster as a decorative, responsive background across the entire homepage hero.
- Added desktop, tablet and mobile image-positioning rules so the worker and construction detail remain visible across aspect ratios.
- Added warm layered overlays and adjusted foreground text rendering for reliable contrast against the detailed artwork.

### Why

The owner disliked the plain hero background and requested the supplied construction artwork with content colors adapted to it.

### Where

- `public/images/construction-poster-background.webp`
- `src/app/page.tsx`
- `src/app/globals.css`

### SEO, accessibility and performance

- The background is decorative and therefore uses empty alternative text.
- Existing semantic headings, descriptive content, structured data and internal links remain unchanged.
- The 198 KB source JPEG was converted to a stripped 168 KB WebP asset.
- Next.js Image supplies responsive loading behavior, while the warm overlays maintain readable navy, charcoal, white and orange foreground colors.

## 25 October 2026 — Owner-supplied business logo integration

### What changed

- Cropped and converted the supplied RV Kumar Traders JPEG logo to an optimized WebP asset.
- Replaced the temporary RV letter mark in the shared public header and footer with the approved logo.
- Added responsive logo sizing for desktop and mobile navigation.
- Added the logo URL to LocalBusiness structured data.

### Why

The owner supplied the business logo and requested that it replace the temporary brand mark.

### Where

- `public/images/rv-kumar-traders-logo.webp`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

### SEO, accessibility and performance

- Header and footer logo instances include descriptive alternative text.
- The LocalBusiness JSON-LD now identifies the business logo for search engines.
- The 198 KB source JPEG was cropped, stripped and converted to a 72 KB WebP asset.
- The existing text business name remains visible beside the logo for readability.

## 25 October 2026 — Transparent logo and full-page poster background

### What changed

- Removed the connected exterior white background from the owner-supplied logo while preserving internal white lettering and artwork details.
- Replaced the boxed header and footer logo asset with the transparent cutout.
- Removed all CSS borders, solid backgrounds and shadows surrounding the logo.
- Moved the construction poster from the hero-only layer to a fixed full-page homepage background.
- Changed homepage section backgrounds to translucent, contrast-controlled surfaces so the poster continues visibly through the full page.

### Why

The owner requested the logo without any surrounding box and clarified that the construction poster should cover the complete homepage rather than only the hero.

### Where

- `public/images/rv-kumar-traders-logo-transparent.webp`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

### Image workflow

- Used the built-in image editing workflow for background extraction.
- Preserved the exact RV KUMAR TRADERS wording, internal white areas, black artwork and yellow construction details.
- Converted the transparent output to an optimized alpha-enabled WebP for production use.

### SEO and accessibility

- Updated LocalBusiness structured data to use the transparent production logo.
- Logo alternative text and visible text branding remain intact.
- The full-page poster remains decorative with empty alternative text, avoiding duplicate screen-reader content.

## 27 October 2026 — SDLC/Figma reconciliation and SEO-first public increment

### Inputs reviewed

- Interactive 70-requirement SDLC Atlas.
- Seven Visual Engineering phase PDFs.
- Phase 3 Figma archive and exported 12-frame overview.
- Three supplied vertical business videos and five supplied image references.

### Decisions

- Phase 3 Figma is the primary visual reference; SDLC/PDF requirements govern behavior and architecture.
- Existing working server-side enquiry functionality is retained where the prototype contains only static form mockups.
- Phone numbers embedded in a filename or video are unverified and must not be published.
- The video containing unverified contact numbers is excluded from all website assets.

### What changed

- Replaced remaining homepage stock imagery with real RVKumar earthmover and lorry footage posters.
- Added a real-operations section with optimized, muted, user-controlled earthmoving and lorry videos.
- Corrected stale homepage copy that incorrectly described the working enquiry form as a future phase.
- Connected homepage quotation CTAs directly to the live enquiry route.
- Added the required About route using confirmed business/location information only.
- Expanded the sitemap to products, product details, enquiry, about, contact and legal routes.
- Added route-specific canonical URLs and enhanced homepage metadata.
- Added dynamic product metadata, Product structured data and Breadcrumb structured data.
- Removed obsolete external Unsplash configuration because all public media is now local.
- Corrected the privacy placeholder so it no longer falsely claims the enquiry form is inactive.

### Media processing

- `rvkumar-earthmovers.mp4`: 720×1280 source reduced from 6.0 MB to a muted 540×960, fast-start 2.4 MB web asset.
- `rvkumar-lorry-service.mp4`: 720×1280 source reduced from 12.9 MB to a muted 540×960, fast-start 5.1 MB web asset.
- Videos use `preload="none"` and optimized poster frames to protect initial page performance.

### SEO safeguards

- Real video files are not loaded until requested by the visitor.
- Core business copy, headings and internal links remain server-rendered.
- No unverified phone number, public price, delivery promise, review or certification was added.
- Product schema intentionally omits Offer markup because public price and guaranteed availability are not published.

## 27 October 2026 — Development-only admin login bypass

### What changed

- Added the server-only `ADMIN_AUTH_BYPASS` environment flag.
- Enabled the flag in the ignored local environment file and documented its default-disabled state in `.env.example`.
- Updated the centralized admin authorization boundary to use the active owner database profile without a Supabase session during local development.
- Redirected the login page directly to the dashboard while local bypass is active.
- Added a visible development-access notice to the admin sidebar.

### Why

The owner requested temporary access to admin development screens without completing the login flow on every local visit.

### Security boundaries

- Bypass is rejected whenever `NODE_ENV` is `production`, even if the environment flag is accidentally set.
- The flag is server-only and is never exposed through a `NEXT_PUBLIC_` variable.
- Authorization still requires an active owner profile from the database.
- Protected admin pages and APIs continue using the centralized `requireActiveAdmin` boundary.
- The local bypass state is visibly identified in the dashboard.

### Where

- `.env.local` (ignored)
- `.env.example`
- `src/lib/env.ts`
- `src/lib/auth/require-admin.ts`
- `src/app/admin/login/page.tsx`
- `src/app/admin/actions.ts`
- `src/components/admin/Sidebar.tsx`
- Admin overview, enquiries and products pages

## 27 October 2026 — Real RVKumar lorry image added to the homepage hero

### What changed

- Added the owner-provided yellow RVKumar tipper-lorry photograph as `public/media/rvkumar-lorry-hero.jpg`.
- Replaced the homepage hero's previous earthmover poster with the exact supplied lorry photograph.
- Updated the image alternative text and homepage Open Graph image metadata to describe the real business vehicle and Aruppukottai service context.
- Set responsive focal positioning so the lorry remains prominent on desktop and mobile crops.

### Why

- The opening visual must immediately show the real RVKumar Traders operation instead of a substitute image.
- Descriptive alternative text and matching Open Graph metadata improve accessibility, local relevance and share-preview consistency without adding keyword spam.

### Where

- `public/media/rvkumar-lorry-hero.jpg`
- `src/components/InteractiveHeroVisual.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

## 27 October 2026 — Full-colour poster background and compact hero overlays

### What changed

- Added the exact supplied `POSTER.jpeg` as `public/images/construction-poster-background.jpg` and selected it as the fixed full-page background.
- Removed the saturation reduction, scale treatment, pale page overlay and translucent hero wash so the supplied artwork retains its original colour.
- Removed the empty dark material-ticket element from the hero.
- Reduced the three floating material thumbnails from 104px to 62px and reduced the Aruppukottai location card, icon and typography.
- Kept both compact overlays responsive on small screens.

### Why

- The supplied construction artwork must remain visually faithful to the original file.
- Smaller overlays reveal more of the real lorry photograph and prevent decorative elements from dominating the hero.

### Where

- `public/images/construction-poster-background.jpg`
- `src/app/page.tsx`
- `src/components/InteractiveHeroVisual.tsx`
- `src/app/globals.css`

## 27 October 2026 — Hero colours aligned with the construction poster

### What changed

- Introduced a localized charcoal glass surface behind the hero copy without altering the full-page poster image.
- Changed the hero heading and supporting copy to warm ivory for contrast.
- Changed emphasis, icons and interactive states to a brighter construction orange sampled from the poster's fire and machinery tones.
- Added responsive padding and corner sizing for the content surface on mobile screens.

### Why

- The previous navy and gray text lost contrast against the detailed black, cream and orange background artwork.
- The localized surface preserves the original poster colour while keeping the primary heading, quotation action and supporting content readable.

### Where

- `src/app/globals.css`

## 27 October 2026 — Cement hero thumbnail fill corrected

### What changed

- Removed the internal padding from the floating cement thumbnail.
- Cropped and enlarged the supplied cement artwork inside its compact card so the product fills the card instead of appearing as a tiny item surrounded by white space.

### Why

- The source artwork includes a large white canvas, which made the cement branding unreadably small in the reduced hero thumbnail.

### Where

- `src/app/globals.css`

## 27 October 2026 — Hero material cards removed and location card repositioned

### What changed

- Removed the complete three-card cement, steel and brick overlay from the homepage hero.
- Moved the “Based in Aruppukottai” card from the bottom-left to the bottom-right.
- Reduced the card width, padding, icon and typography further on desktop and mobile.

### Why

- The material thumbnails obscured the lorry photograph and were no longer required.
- The smaller right-aligned location label keeps the location visible without dominating the hero.

### Where

- `src/components/InteractiveHeroVisual.tsx`
- `src/app/globals.css`

## 27 October 2026 — Homepage hero made static

### What changed

- Removed cursor and pointer tracking from the homepage hero.
- Removed dynamic perspective rotation, parallax translations and cursor-following shine.
- Removed the decorative moving grid and glow layers.
- Kept the lorry photograph and Aruppukottai label fixed in their responsive positions.
- Converted the hero visual back to a server component by removing client-side React hooks and event handlers.

### Why

- The interactive movement was visually distracting and the requested presentation is static.
- Removing unnecessary client-side interaction also reduces browser JavaScript for the opening section.

### Where

- `src/components/InteractiveHeroVisual.tsx`
- `src/app/globals.css`

## 27 October 2026 — Hero lorry asset cache reset

### What changed

- Published the verified RVKumar yellow lorry photograph under the new cache-safe path `public/media/rvkumar-lorry-static-v2.jpg`.
- Updated the static hero and homepage social metadata to use the new path.

### Why

- The source code and server image response were verified as the correct lorry photograph, but the browser displayed a stale brick image from previous hot-reload state.
- A new asset URL prevents the browser and Next.js image optimizer from reusing the stale response.

### Where

- `public/media/rvkumar-lorry-static-v2.jpg`
- `src/components/InteractiveHeroVisual.tsx`
- `src/app/page.tsx`

## 27 October 2026 — Development watcher stabilized for accurate hero reloads

### What changed

- Enabled Watchpack polling for the local `npm run dev` command.
- Prepared the generated `.next` development cache for a clean rebuild.

### Why

- The terminal reported `ENOSPC: System limit for number of file watchers reached`.
- Because the watcher stopped observing `src/components`, the browser retained an obsolete client component containing brick, steel and cement cards, causing a hydration mismatch even though the current source contains only the lorry image.
- Polling avoids dependence on the exhausted operating-system watcher allocation and allows current source edits to reload reliably.

### Where

- `package.json`
- Generated `.next` development cache

## 27 October 2026 — Material selection rows redesigned

### What changed

- Grouped every checkbox immediately before its corresponding material name inside one clickable label.
- Added fixed checkbox sizing so global text-input styles can no longer stretch or displace checkboxes.
- Tightened and aligned the quantity and unit inputs on the right side of each desktop row.
- Added a clear orange selected-row state.
- Changed mobile rows to place the checkbox and material name on the first line, with quantity and unit fields side by side below.
- Added accessible quantity labels for screen readers.

### Why

- The global input width rule caused checkboxes to appear detached from their material names.
- Each material must read as one distinct selection control before its associated quantity and unit fields.

### Where

- `src/components/EnquiryForm.tsx`
- `src/app/globals.css`

## 27 October 2026 — Professional hero-only poster treatment

### What changed

- Moved the supplied construction poster from a fixed full-page background into the homepage hero only.
- Preserved the poster's original colour inside the hero without a global colour-reducing overlay.
- Replaced translucent, blurred section backgrounds with intentional solid surfaces:
  - warm white for the product and quotation sections;
  - warm neutral for real operations;
  - white for delivery and FAQs;
  - solid navy for the process section and footer.
- Retained the localized dark hero text surface and the separate real lorry photograph for readability and business authenticity.

### Why

- A full-page photographic background competed with product images and made long-form content visually busy.
- Professional B2B websites normally concentrate strong imagery in the hero, then use calm surfaces to establish hierarchy, readability and product focus.

### Where

- `src/app/page.tsx`
- `src/app/globals.css`

## 27 October 2026 — Hero poster intensity softened

### What changed

- Added a warm ivory base behind the hero poster.
- Reduced only the poster layer opacity to 82% so the artwork appears lighter and less visually intense.
- Kept the real lorry photograph, hero content colours and all lower-page section backgrounds unchanged.

### Why

- The full-colour poster was visually brighter than the surrounding interface and competed with the hero content.

### Where

- `src/app/globals.css`

## 27 October 2026 — Catalogue products retired and delivery badge removed

### What changed

- Removed Ready Mix Concrete and Build Essentials from the homepage catalogue and structured product list.
- Removed their unused catalogue image files from `public/images/products`.
- Excluded both retired product slugs from public catalogue queries, enquiry material choices, direct published-product routes and the current admin catalogue.
- Added a database migration and seed behavior that mark both products unpublished and unavailable while retaining historical enquiry relationships.
- Renamed Bricks & Stones to Bricks in the homepage, seed data and existing database records.
- Removed the orange “Local service review” badge from the delivery image.
- Reduced the hero poster opacity from 82% to 68% for a lighter background treatment.

### Why

- The owner removed Ready Mix Concrete and Build Essentials from the active product offering and simplified the bricks product name.
- Historical enquiry records must remain valid, so removed products are retired instead of destructively deleted from relational data.
- The delivery badge unnecessarily covered the real lorry image.

### Where

- `src/app/page.tsx`
- `src/services/product.service.ts`
- `src/app/globals.css`
- `prisma/seed.sql`
- `prisma/migrations/20261027000100_retire_products_and_rename_bricks/migration.sql`
- `docs/PRD.md`

## 27 October 2026 — Real lorry-yard photograph selected as hero background

### What changed

- Added the exact owner-supplied edited lorry-yard photograph as `public/images/rvkumar-lorry-yard-background.jpg`.
- Replaced the illustrated construction poster in the homepage hero background with this real operational image.
- Set responsive focal positions to keep the lorries and yard visible across desktop, tablet and mobile crops.
- Retained the previously approved softened background intensity so foreground content remains readable.

### Why

- The owner selected this real RVKumar operational photograph as the preferred homepage background.

### Where

- `public/images/rvkumar-lorry-yard-background.jpg`
- `src/app/page.tsx`
- `src/app/globals.css`

## 27 October 2026 — Lorry-yard hero background change reverted

### What changed

- Restored `construction-poster-background.jpg` as the homepage hero background.
- Restored the previous desktop, tablet and mobile focal positions used for the construction poster.
- Removed the briefly added lorry-yard background asset from the active implementation.

### Why

- The owner requested that the immediately preceding lorry-yard background change be reverted.

### Where

- `src/app/page.tsx`
- `src/app/globals.css`
- `public/images/rvkumar-lorry-yard-background.jpg`

## 27 October 2026 — Removed catalogue rows deleted from PostgreSQL

### What changed

- Queried the local PostgreSQL database and confirmed that Ready Mix Concrete and Build Essentials each had zero enquiry-item references.
- Added and applied a migration that physically deletes both products from the `products` table.
- Removed the temporary service-layer slug exclusions because the records no longer exist.
- Removed the obsolete retirement update from the seed file; fresh databases now create only the approved active catalogue.
- Retained the generic Prisma `Product` model because product names are database records, not schema fields or enum values.

### Why

- The owner wanted the catalogue change represented in the backend database itself, not only hidden in frontend rendering.
- Reference checks established that physical deletion was safe and would not break historical enquiries.

### Where

- `prisma/migrations/20261027000200_delete_removed_products/migration.sql`
- `prisma/seed.sql`
- `src/services/product.service.ts`
- Local PostgreSQL `products` table

## 28 October 2026 — Customer CRM backend foundation

### What changed

- Added persistent customer records deduplicated by normalized phone number.
- Linked every enquiry to a customer and added lead source plus optional follow-up time.
- Added enquiry activity history for creation, notes, status changes and follow-up changes.
- Added protected customer list/detail endpoints and a protected enquiry-note endpoint.
- Expanded the protected enquiry update endpoint to handle workflow status and follow-up dates.
- Added validation and tests for admin workflow updates and notes.
- Applied migration `20261027000300_add_customer_crm_foundation` to local PostgreSQL and regenerated the Prisma client.

### Why

- The owner needs enquiry history, customer continuity, notes and reminders to operate as a basic CRM rather than a one-time form inbox.
- Customer matching and activity creation must happen on the server in the same transaction as the enquiry, not in the browser.

### How

- Prisma services now upsert customers and create activity/audit records transactionally.
- Protected route handlers call the owner authorization guard before reading or mutating customer and enquiry data.
- Row-level security and table grants continue to deny direct browser access to CRM tables.

### Where

- `prisma/schema.prisma`
- `prisma/migrations/20261027000300_add_customer_crm_foundation/migration.sql`
- `src/services/enquiry.service.ts`
- `src/validators/enquiry.schema.ts`
- `src/app/api/enquiries/[id]/route.ts`
- `src/app/api/enquiries/[id]/notes/route.ts`
- `src/app/api/customers/route.ts`
- `src/app/api/customers/[id]/route.ts`
- `tests/enquiry.test.ts`

## 28 October 2026 — Responsive navigation accessibility repair

### What changed

- Replaced the non-functional public mobile menu icon with an expandable navigation menu containing all public destinations and the quotation CTA.
- Added `aria-expanded`, `aria-controls`, descriptive labels and automatic menu closing after navigation.
- Restored access to all admin destinations at tablet widths using icon navigation.
- Restored admin navigation at phone widths as a compact, touch-sized horizontal control group.
- Hid the development-bypass notice on very small screens so it no longer crowds operational navigation.

### Why

- Rendered screenshots confirmed that public navigation could not be opened on phones and admin destinations disappeared at tablet and phone widths.
- Core features must remain reachable without requiring a desktop display.

### Where

- `src/components/Header.tsx`
- `src/app/globals.css`
- `docs/responsive-audit/2026-10-28-before/`
- `docs/responsive-audit/2026-10-28-after/`

## 28 October 2026 — Commercial operations backend completed

### What changed

- Added quotation drafts and revisions with configurable line-level tax, transport, discount, validity and terms.
- Added quotation issue/accept/reject/expiry decisions and accepted-quotation order conversion.
- Added controlled order and delivery lifecycles, cancellation reasons and proof paths.
- Added manual payments, reversal history and outstanding-balance reporting.
- Added owner-only APIs and admin pages for customers, quotations, orders, deliveries and payments.
- Added server-generated quotation PDFs and signed private delivery-proof uploads.
- Added an idempotent email/SMS outbox with retries, Resend/Twilio adapters and a cron-protected processor.
- Added same-origin enforcement and database-backed hashed-IP rate limiting to public enquiries.
- Applied both new migrations to local PostgreSQL and added commercial-workflow tests.

### Why

- The owner needs the full operational path from enquiry through delivery and payment without showing prices publicly.
- Provider failures must not roll back saved enquiries, while financial corrections must retain history.
- Public forms and private delivery documents require server-side abuse and access controls.

### How

- Zod validates commands before transactional Prisma services enforce lifecycle rules and append audit events.
- Database constraints reject invalid quantities/amounts and prevent duplicate order conversion.
- Notification delivery is asynchronous with idempotency keys and bounded backoff.

### Where

- `prisma/schema.prisma`
- `prisma/migrations/20261028000100_add_commercial_operations/migration.sql`
- `prisma/migrations/20261028000200_add_enquiry_rate_limit/migration.sql`
- `src/services/operations.service.ts`
- `src/validators/operations.schema.ts`
- `src/app/api/quotations/`, `src/app/api/orders/`, `src/app/api/deliveries/`, `src/app/api/payments/`
- `src/lib/quotation-pdf.ts`, `src/lib/notifications.ts`, `src/lib/rate-limit.ts`, `src/lib/storage.ts`
- `src/app/admin/`
- `tests/operations.test.ts`

## 28 October 2026 — Editable owner administration workspace

### What changed

- Replaced view-only enquiry records with owner controls for lead status, follow-up time and internal notes.
- Added editable customer name and email records while keeping phone identity and history visible.
- Added product creation plus publication and availability controls.
- Added quotation creation from enquiry items with manual unit rates, per-line GST, transport, discount, validity and terms.
- Added manual quotation issue, acceptance/rejection, PDF export and accepted-quotation order conversion.
- Added manual order progression, cancellation reasons and delivery scheduling with driver/vehicle details.
- Added delivery progression controls and manual payment recording/reversal controls.
- Added responsive editor, record-card and action-control styling for phone, tablet and desktop use.

### Why

- The owner must remain in control of prices, quotations, orders, deliveries and payments; automation should assist but never make commercial decisions.

### How

- Small client components handle form state and call the existing protected route handlers.
- Server pages continue loading authoritative records directly from Prisma and refresh after successful mutations.
- Every mutation still passes through validation, authorization, lifecycle rules and audit logging.

### Where

- `src/components/admin/EnquiryManager.tsx`
- `src/components/admin/CustomerManager.tsx`
- `src/components/admin/ProductManager.tsx`
- `src/components/admin/QuotationManager.tsx`
- `src/components/admin/OrderManager.tsx`
- `src/components/admin/DeliveryManager.tsx`
- `src/components/admin/PaymentManager.tsx`
- `src/app/admin/`
- `src/app/globals.css`

## 29 October 2026 — Terracotta Studio public-website redesign

### What changed

- Reworked the existing customer-facing presentation into a premium ivory, charcoal and terracotta editorial system without changing public URLs or business workflows.
- Replaced the previous poster/lorry hero treatment with the supplied golden-hour multi-storey construction photograph and the approved “Build it better. Build it stronger.” headline.
- Simplified the public navigation, added a clear mobile close state and retained the quotation CTA.
- Removed pointer-driven 3D product-card movement in favour of stable, image-led material cards with restrained hover feedback.
- Applied the design system to catalogue, product-detail, enquiry, about, contact, privacy and terms pages.
- Added the shared header and footer to the legal pages for consistent navigation.
- Updated public metadata language to match the current product scope and changed the homepage Open Graph image to the new local hero asset.
- Added responsive and visual evidence for 375 px, 768 px and 1440 px viewports.

### Why

- The public website needed to match the supplied minimalist construction reference while preserving the live application and its SEO, catalogue and enquiry integrations.
- A stable editorial layout provides stronger hierarchy, better mobile readability and a more professional visual identity than the earlier decorative 3D treatment.

### How

- Added an isolated customer-facing CSS layer after the existing global stylesheet so admin selectors and workflows remain unchanged.
- Converted the supplied 1672 × 941 PNG to an optimized 282 KB local WebP and served it through `next/image` with responsive sizes, configured image quality and reserved aspect ratio.
- Reused the existing page routes, server services, database product records, structured data and enquiry submission component.
- Verified formatting, TypeScript, ESLint, unit tests, production build, public HTTP routes and browser-rendered responsive layouts.

### Where

- `src/app/public-redesign.css`

## 29 October 2026 — Industrial Editorial direction selected

### What changed

- Reworked the homepage hero into the selected light Industrial Editorial composition with a serif display headline, terracotta emphasis and large golden-hour construction photography.
- Reduced the homepage material showcase to five featured entries with a direct link to the complete database-backed catalogue.
- Changed the mobile featured-material area to a horizontal snap carousel to reduce page length.
- Preserved navigation, quotation actions, operational sections and all existing integrations.

### Why

- The selected concept provides a more distinctive architectural identity while remaining familiar, minimal and responsive.

### Where

- `src/app/page.tsx`
- `src/app/public-redesign.css`

## 29 October 2026 — Industrial Editorial fidelity correction

### What changed

- Replaced the conventional split-panel hero with one continuous full-width photographic scene.
- Added the reference-style ivory image fade behind the editorial headline while keeping text and actions as semantic HTML.
- Expanded the embedded navigation and trust rail across the viewport.
- Reorganized the homepage material showcase into a left editorial introduction and four-column visual material rail on desktop.
- Retained the compact stacked experience and swipeable material rail on mobile.

### Why

- Browser comparison showed that the earlier adaptation did not reproduce the defining composition of the selected Concept 1 visual.

### Where

- `src/app/public-redesign.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/products/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/InteractiveProductCard.tsx`
- `public/images/golden-hour-construction-hero.webp`
- `docs/redesign-qa/2026-10-29/`
- `design-qa.md`

## 29 October 2026 — Homepage navigation integrated into hero

### What changed

- Added an optional overlay presentation to the shared public header.
- Positioned the homepage navigation inside the charcoal hero with compact white navigation and a transparent quotation action.
- Preserved the standard ivory header on catalogue, enquiry, about, contact and legal pages.
- Added mobile-specific contrast and menu-panel styling for the overlaid navigation.

### Why

- The supplied reference places navigation inside the hero rather than in a separate page-level bar.

### How

- The reusable header now accepts an `overlay` presentation flag; no routes, navigation destinations or business logic changed.

### Where

- `src/components/Header.tsx`
- `src/app/page.tsx`
- `src/app/public-redesign.css`
