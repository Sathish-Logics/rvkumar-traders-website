# RVKumar Traders Digital Sales and Operations Platform

**Document type:** Product Requirements Document  
**Version:** 0.1  
**Status:** Draft for owner review  
**Last updated:** 24 October 2026  
**Business owner:** RVKumar Traders

## 1. Product summary

RVKumar Traders needs a mobile-first public website and a secure administration application for its construction-materials trading business. The product must help prospective customers discover the business and request quotations, then help the owner manage each enquiry through quotation, order, delivery, and payment completion.

The product is an operational sales system, not merely a brochure website. It must reduce repeated manual work without prematurely adding inventory, accounting, online payment, vehicle tracking, or automated marketing complexity.

## 2. Business information

| Field                 | Current value                                                                     |
| --------------------- | --------------------------------------------------------------------------------- |
| Business name         | RVKumar Traders                                                                   |
| Primary area          | Madurai and Virudhunagar District                                                 |
| Local address context | Aathipatti, Aruppukottai Taluk, Tamil Nadu 626101                                 |
| GST registration      | Registered; legal GST details to be supplied                                      |
| Administrator         | One owner-admin for the MVP                                                       |
| Phone                 | Editable placeholder until confirmed                                              |
| WhatsApp              | Editable placeholder until confirmed                                              |
| Email                 | Editable placeholder until confirmed                                              |
| Logo                  | Temporary text wordmark until supplied                                            |
| Photography           | Replaceable licensed/demo imagery initially; real photographs will be added later |

No unverified address detail, registration number, certification, customer review, service claim, or business history may be published.

## 3. Goals and success measures

### Business goals

1. Generate genuine sales enquiries from serviceable locations.
2. Make multi-material quotation requests easy on mobile devices.
3. Give the owner one reliable view of leads and required follow-ups.
4. Produce consistent, professional, versioned quotations.
5. Track accepted work through delivery and payment completion.
6. Establish a technically sound foundation for local SEO.

### Initial success measures

- Completed quotation enquiries by channel and landing page.
- Click-to-call and click-to-WhatsApp conversions.
- Enquiry-to-qualified-lead conversion rate.
- Quotation sent and quotation accepted rates.
- Median first-response time.
- Leads with overdue follow-ups.
- Orders awaiting delivery.
- Total and overdue outstanding balances.

Targets will be set after enough genuine operating data has been collected. Demo data must never be included in real performance reports.

## 4. Users

### Prospective customers

- Individual house owners.
- Civil engineers.
- Building contractors.
- Construction companies.
- Property developers.
- Small and medium-sized builders.

Customers are expected to use smartphones frequently and may prefer calling or WhatsApp over a long digital purchase flow.

### Internal user

- **Owner-admin:** full access to enquiries, customers, quotations, products, orders, deliveries, payments, reports, settings, and audit history.

The data model and authorization system must support additional roles later, but no staff-management workflow is required in the first release.

## 5. Product catalogue

The initial catalogue contains the following owner-provided names:

1. UltraTech Cement
2. Agni Steel
3. TSRM Steel
4. M-Sand
5. P-Sand
6. Keraval
7. Sali Kaal
8. EarthMovers
9. Chunambu
10. Tiles Paste
11. Waterproofing Oil
12. Bricks
13. Stones
14. Concrete

The published spelling, category, units, specifications, and whether each entry is a brand or product must be confirmed before production content is finalized. The administration application must allow the owner to change these details without code changes.

### Catalogue rules

- Do not display prices publicly.
- Do not display starting prices or price ranges.
- Product pages should direct customers to enquire for current commercial details.
- The owner may hide unavailable products.
- Products may have categories, brands, specifications, units, availability, display order, and SEO content.
- Product imagery must be replaceable from the admin application in a later increment or through managed content in the MVP if time permits.
- Historical quotation lines must retain their original description, quantity, rate, tax, and totals even after a product changes.

## 6. MVP scope

### Included

- Responsive customer-facing website.
- Search-friendly category and product pages.
- Multi-product quotation enquiry.
- Unique enquiry reference number.
- Customer acknowledgement by page, email, SMS, and WhatsApp where configured and consented.
- Secure owner-admin authentication.
- Lead pipeline and follow-up reminders.
- Customer records and activity history.
- Product and availability management.
- Quotation creation, revision history, and PDF export.
- Manual quotation sharing by WhatsApp and email.
- Accepted quotation to order conversion.
- Basic order, partial-delivery, and delivery-status tracking.
- Manual advance, partial, and balance payment recording.
- Operational dashboard and simple reports.
- Server-side authorization, validation, rate limiting, audit history, and privacy controls.
- SEO, sitemap, structured data, analytics readiness, and conversion events.

### Deferred

- Customer accounts and self-service portal.
- Public prices or checkout.
- Online payment gateway.
- Advanced stock and warehouse management.
- Automated accounting integration.
- Vehicle GPS and route optimization.
- Automated WhatsApp marketing or unofficial WhatsApp automation.
- Fully automated invoice filing or GST compliance workflows.
- Multi-branch and multi-company operations.

## 7. Customer experience requirements

### Homepage

The homepage must communicate what RVKumar Traders supplies, where it operates, and how to request a quotation. It should include:

- Clear, factual value proposition.
- Construction-material imagery.
- Product-category navigation.
- Prominent Request Quotation, Call, and WhatsApp actions.
- Product and delivery-process highlights using only verified claims.
- Verified service-area summary.
- Business-information section.
- FAQ using factual answers.
- Compact contact/enquiry entry point.

Testimonials must remain absent until genuine, publishable testimonials are supplied.

### Catalogue and product pages

Each product page should contain a name, category, relevant specifications, available unit choices, availability wording, imagery, supporting description, delivery-area context, FAQs where useful, and a quote-request action. Pages must not expose commercial rates.

### Bulk quotation enquiry

A customer must be able to:

- Add multiple materials.
- Choose or enter quantities and units.
- Provide name and mobile number.
- Optionally provide email.
- Enter delivery location and PIN code.
- Select a preferred delivery date.
- Add special instructions.
- consent to being contacted regarding the request.
- Review and submit the request on a mobile device.

On successful submission, the system must:

1. Validate and rate-limit the request server-side.
2. Store the enquiry and its material lines securely.
3. Generate a non-guessable, human-readable reference number.
4. Show a confirmation page.
5. Notify the owner through configured channels.
6. Send the customer an acknowledgement through configured, consented channels.
7. Offer Call and prefilled WhatsApp actions.

Submission creates an enquiry and lead only. It must not create a quotation or order automatically.

## 8. Admin requirements

### Dashboard

Show actionable counts and lists for new enquiries, overdue follow-ups, pending quotations, expiring quotations, accepted quotations awaiting conversion, active orders, pending deliveries, overdue balances, and recent activity. Every count should open the matching filtered work queue.

### Lead management

Pipeline stages:

`New -> Contacted -> Qualified -> Quotation Sent -> Negotiation -> Won / Lost`

Each lead must retain customer details, requested materials, source, stage, next follow-up, owner notes, loss reason where relevant, and a chronological activity history.

### Customer records

Store customer identity, phone, optional email, customer type, delivery locations, enquiries, quotations, orders, payments, and outstanding balances. Avoid unnecessary personal information.

### Quotations

The owner must be able to create a quotation from an enquiry or customer, add line items, enter current rates, configure product-specific GST, add transport and other charges, apply discounts, set validity, and define payment and delivery terms.

The system must calculate totals deterministically on the server. Each issued revision becomes an immutable numbered version. Drafts may be edited; an issued version must be revised rather than overwritten. PDFs must use the business details configured by the owner.

### Quotation acceptance

For the MVP, acceptance is recorded manually by the owner after receiving confirmation through phone, WhatsApp, email, or a signed document. The owner records the acceptance method, date, note, and optional supporting file. This method is configurable later.

### Orders and deliveries

An accepted quotation may be explicitly converted into an order. Order stages are:

`Confirmed -> Preparing -> Dispatched -> Delivered -> Completed`

Cancellation must be supported with reason and audit history. An order may have multiple deliveries. Each delivery can record scheduled date, address, quantities, vehicle and driver details when applicable, status, notes, and optional proof of delivery.

### Payments

Payments are recorded manually against an order. The system must support advances and partial payments, method, reference, received date, note, total received, remaining balance, and payment status. Editing or reversing a payment must leave an audit trail.

### Product management

The owner can add, edit, order, publish, unpublish, and mark products unavailable; manage categories, brands, specifications, units, media, and internal pricing information; and update SEO fields. Internal prices must not be exposed on public endpoints.

## 9. Notifications and automation

### MVP notifications

- Owner notification for a new enquiry.
- Customer acknowledgement after enquiry submission.
- In-dashboard follow-up reminders.
- Quotation-expiry warnings.
- Overdue-payment indicators.
- Pending-delivery and pending-work alerts.

Email, SMS, and WhatsApp require valid sender/provider configuration. The initial implementation should use transactional email, an approved SMS provider, and manual WhatsApp links. Automated WhatsApp messages remain a future approved-provider integration. Failure to send a notification must not lose or roll back a successfully stored enquiry.

## 10. Information architecture

### Public sitemap

```text
/
|-- /products
|   |-- /products/[category]
|   `-- /products/[product]
|-- /request-quotation
|-- /delivery-areas
|   `-- /delivery-areas/[verified-location]
|-- /about
|-- /contact
|-- /enquiry/[reference]/confirmation
|-- /privacy
`-- /terms
```

Location pages may only be published for genuinely serviceable locations and must contain distinct, useful content rather than duplicated doorway pages.

### Admin sitemap

```text
/admin/login
/admin
|-- /enquiries
|-- /leads
|-- /customers
|-- /quotations
|-- /orders
|-- /deliveries
|-- /payments
|-- /products
|-- /reminders
|-- /reports
|-- /audit-log
`-- /settings
```

## 11. Key user journeys

### Enquiry to order

1. Customer discovers a verified landing or product page.
2. Customer opens the quotation form with the relevant product preselected.
3. Customer adds materials and delivery details and consents to contact.
4. System validates, stores, acknowledges, and alerts the owner.
5. Owner reviews and contacts the lead.
6. Owner qualifies the requirement and schedules follow-up.
7. Owner produces and issues a quotation.
8. Revisions are created as new versions when required.
9. Owner records acceptance.
10. Owner explicitly converts the accepted quotation to an order.
11. Deliveries and payments are recorded until completion.

### Returning customer

The owner finds the existing customer by phone number, reviews previous activity and delivery locations, and creates a new enquiry or quotation without duplicating the customer unnecessarily.

## 12. Design system

### Brand direction

The approved direction is modern industrial, trustworthy, and practical.

| Token          | Value     | Intended use                           |
| -------------- | --------- | -------------------------------------- |
| Navy           | `#17324D` | Primary brand, navigation, headings    |
| Orange         | `#E87524` | Primary calls to action and highlights |
| Warm off-white | `#F7F4EE` | Main page background                   |
| Charcoal       | `#20262D` | Body text                              |
| Concrete gray  | `#68727D` | Secondary text and supporting UI       |
| WhatsApp green | `#25D366` | WhatsApp action only                   |

Colors must be adjusted where necessary to achieve WCAG AA contrast. Orange must not be used as small text on a light background if it fails contrast.

### Typography

- **Headings and temporary wordmark:** Manrope.
- **Body and interface:** Inter.
- Use locally optimized Next.js fonts to reduce layout shift.
- Minimum comfortable mobile body size: 16px.
- Minimum interactive target: 44 by 44 CSS pixels.

### Interface principles

- Mobile-first responsive composition.
- Plain language and short forms.
- High-visibility but non-aggressive CTAs.
- One primary action per section.
- Semantic HTML, visible focus states, keyboard support, and meaningful alternative text.
- Tables become useful cards or horizontal views on small screens.
- Status must never be communicated by color alone.
- Use a temporary text wordmark until the logo is provided.

## 13. SEO and acquisition requirements

- Server-rendered or statically generated public pages where appropriate.
- Clean, stable, descriptive URLs.
- Unique titles, descriptions, canonical URLs, and social preview metadata.
- Organization/LocalBusiness, Product, BreadcrumbList, and FAQ structured data only when page content supports it.
- XML sitemap and robots configuration.
- Search Console verification readiness.
- Accurate name, address, and phone consistency after real details are supplied.
- Fast Core Web Vitals through optimized images, fonts, and limited client JavaScript.
- Descriptive internal links and breadcrumb navigation.
- No generated location spam, copied descriptions, hidden keywords, fake ratings, or unsupported claims.
- Analytics events for enquiry start, enquiry success, call click, WhatsApp click, email click, and product interest.
- Consent and privacy handling appropriate to the selected analytics tools.

SEO creates discoverability foundations but does not guarantee traffic or rankings. Content, local listings, genuine reputation, and ongoing optimization will remain necessary.

## 14. Technical architecture

### Proposed stack

- Next.js App Router with TypeScript.
- Tailwind CSS and shadcn/ui.
- PostgreSQL hosted by Supabase.
- Supabase Auth and private Storage buckets.
- Zod validation at all trust boundaries.
- Server Actions and route handlers calling domain services.
- A React-compatible server PDF solution selected during technical design.
- Vercel-compatible deployment.

### Module boundaries

```text
Public website and SEO pages
Admin application
Authentication and authorization
Enquiry and lead services
Customer service
Product catalogue service
Quotation calculation and PDF service
Order and delivery services
Payment service
Notification adapters
Reporting queries
Audit service
Database and storage adapters
```

Public pages must never query private commercial or customer data directly. Business calculations, authorization decisions, status transitions, and audit creation belong on the server.

## 15. Security, privacy, and reliability

- Supabase session authentication for the owner-admin.
- Server-side authorization for every protected operation.
- Row Level Security as defense in depth, not as the sole application check.
- Service-role keys restricted to server-only environments.
- Rate limiting and bot mitigation on public forms.
- Zod validation and normalized phone/PIN input.
- Secure, private document buckets with short-lived signed access.
- Audit events for authentication-sensitive and business-critical changes.
- Minimal collection and display of customer personal data.
- Privacy notice and explicit enquiry-contact consent.
- Configurable retention and safe deletion/anonymization process.
- Database backup and restore procedure documented before launch.
- Idempotency protection for enquiry creation and notification retries.
- Error monitoring without leaking customer or secret data.

## 16. Audit requirements

### Product audit log

Important mutations must record:

- Event type and affected entity.
- Actor identity.
- Date and time.
- Before and after values, with secrets excluded.
- Reason or note when required.
- Request/correlation identifier where available.

Initial audited actions include lead stage and assignment changes, notes, quotation issue/revision/status changes, order creation/status/cancellation, delivery changes, payment creation/edit/reversal, product visibility and configuration changes, settings changes, and authentication/security events. Audit entries must not be editable through the normal application.

### Development audit log

Repository work will be recorded separately in `docs/DEVELOPMENT_AUDIT_LOG.md`, including what changed, why it changed, how it was verified, and where the change was made. Secrets and unnecessary personal information must not be written into that log.

## 17. Acceptance criteria for the MVP

The MVP is acceptable when:

1. A mobile customer can submit a valid multi-product enquiry and receive a reference.
2. Duplicate submission protection and rate limiting work.
3. The owner can securely sign in and see the new lead.
4. Lead stages, notes, history, and reminders persist correctly.
5. Products can be managed without code changes and public prices are never exposed.
6. A versioned quotation with configurable taxes can be issued and exported as PDF.
7. An accepted quotation can be explicitly converted to an order.
8. Partial deliveries and partial payments can be recorded correctly.
9. Important mutations generate immutable audit entries.
10. Public pages meet agreed responsive, accessibility, SEO, and performance checks.
11. Environment setup, migrations, backup approach, tests, and deployment are documented.

## 18. Current decisions and open items

### Confirmed decisions

- Rebuild the current Vite starter as Next.js.
- Use the business name RVKumar Traders.
- Use navy and construction orange with Manrope and Inter.
- Do not publish prices; commercial terms follow an enquiry.
- Use one owner-admin initially while keeping future roles possible.
- Prepare for email and SMS acknowledgements and manual WhatsApp sharing.
- Treat the business as GST registered, with exact details still pending.
- Prioritize SEO and mobile usability.
- Build and review the product incrementally rather than all at once.

### Required before production launch

- Confirm legal business spelling and capitalization.
- Supply real phone, WhatsApp, email, complete address, GSTIN, and business hours.
- Confirm actual serviceable locations and delivery rules.
- Confirm catalogue spellings and classifications, especially Keraval and Sali Kaal.
- Confirm units and specifications for every material.
- Select transactional email and SMS providers and provide verified sender details.
- Supply logo and approved photography when ready.
- Approve privacy, quotation, payment, cancellation, and delivery terms.

## 19. Proposed delivery phases

1. **Product definition:** PRD, journeys, sitemap, design specification, architecture decisions.
2. **Technical design:** database ERD, authorization matrix, service/API contracts, event and audit model.
3. **Foundation:** Next.js rebuild, design tokens, layouts, authentication, database migrations.
4. **Public experience:** homepage, catalogue, product pages, quotation enquiry, SEO foundations.
5. **Sales operations:** dashboard, leads, customers, follow-ups, activity history.
6. **Commercial workflow:** quotations, PDF, revisions, acceptance, orders.
7. **Fulfilment and finance:** deliveries, partial fulfilment, manual payments, reports.
8. **Hardening and launch:** tests, accessibility, security review, performance, backup, deployment documentation.

Each phase should be reviewed before advancing to the next.
