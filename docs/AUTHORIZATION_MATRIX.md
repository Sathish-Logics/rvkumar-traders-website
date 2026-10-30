# Authorization and Data Access Matrix

**Version:** 0.1  
**Status:** Proposed  
**Last updated:** 24 October 2026

## 1. Authorization model

The MVP has one active `owner` role. Future roles are designed now so permissions do not become hardcoded to a single person. UI visibility is convenient guidance only; every protected read and mutation must be authorized on the server and constrained by database Row Level Security.

Legend: `R` read, `C` create, `U` update, `A` archive, `X` execute a controlled business action, `—` denied.

## 2. Role matrix

| Resource/action         |          Public | Owner | Future manager | Future sales | Future operations | Future accounts |
| ----------------------- | --------------: | ----: | -------------: | -----------: | ----------------: | --------------: |
| Published catalogue     |               R |  RCUA |           RCUA |            R |                 R |               R |
| Internal pricing        |               — |  RCUA |           RCUA |            R |                 R |               R |
| Submit enquiry          |               C |     C |              C |            C |                 — |               — |
| All enquiries           |               — |  RCUA |            RCU |          RCU |                 R |               R |
| Lead stage/follow-up    |               — |    RX |             RX |           RX |                 R |               R |
| Lead notes/activity     |               — |    RC |             RC |           RC |                 R |               R |
| Customers/addresses     |               — |  RCUA |            RCU |          RCU |                 R |               R |
| Draft quotations        |               — |  RCUA |           RCUA |          RCU |                 R |               R |
| Issue/revise quotation  |               — |     X |              X |            X |                 — |               — |
| Accept/reject quotation |               — |     X |              X |            X |                 — |               — |
| Convert to order        |               — |     X |              X |            X |                 — |               — |
| Orders                  |               — |  RCUA |            RCU |            R |               RCU |               R |
| Cancel order            |               — |     X |              X |            — |                 — |               — |
| Deliveries              |               — |  RCUA |            RCU |            R |               RCU |               R |
| Proof of delivery       |               — |    RX |             RX |            R |              RCUX |               R |
| Payments                |               — | RCU/X |          RCU/X |            R |                 R |           RCU/X |
| Reports                 |               — |     R |              R |    limited R |     operational R |     financial R |
| Business settings       | public subset R |   RCU |            RCU |            R |                 R |               R |
| Admin users/roles       |               — |  RCUA |              — |            — |                 — |               — |
| Audit events            |               — |     R |              R |    limited R |         limited R |       limited R |
| Modify audit event      |               — |     — |              — |            — |                 — |               — |

Only the owner role will be enabled in the MVP. Future-role columns are a compatibility design, not committed first-release UI.

## 3. Public access rules

Anonymous visitors may:

- Read explicitly published catalogue and business content.
- Submit a rate-limited enquiry with consent.
- Access their confirmation only through a short-lived response or unguessable confirmation token.
- Open external call, email, and WhatsApp links.

Anonymous visitors may not:

- Read customer, enquiry, internal pricing, quotation, order, delivery, payment, settings, or audit tables.
- Enumerate enquiry reference numbers.
- Upload arbitrary files in the enquiry MVP.
- invoke provider callbacks or admin mutations.

## 4. Sensitive controlled actions

The following actions require explicit services, validation, and an audit event rather than a generic update:

- Issue or supersede a quotation version.
- Record quotation acceptance or rejection.
- Convert a quotation to an order.
- Cancel an order.
- Dispatch or complete a delivery.
- Record, edit, or reverse a payment.
- Override an excessive delivery quantity.
- Change tax/business settings.
- Archive a customer or catalogue record.
- Activate/deactivate an admin profile.

Reversal, cancellation, and override actions require a reason.

## 5. Row Level Security direction

- Public catalogue access uses narrow views or policies requiring `published = true` and `archived_at is null`.
- Public enquiry creation should use a controlled server endpoint; direct anonymous table writes are denied where practical.
- Authenticated admin access requires an active `admin_profiles` row.
- Private storage access is granted through server-generated signed URLs after entity authorization.
- Audit-event inserts occur through trusted server/database functions; updates and deletes are denied.
- Service-role usage is isolated to server-only adapters and never used as a shortcut around application authorization.

## 6. Authorization test cases

1. Anonymous users cannot select any customer record.
2. Anonymous users cannot discover an enquiry using sequential references.
3. An inactive admin cannot access a protected page or API.
4. An authenticated user without an admin profile is denied.
5. A sales role cannot reverse a payment or change business settings.
6. An operations role cannot view internal quotation margin fields if added later.
7. A payment reversal without a reason is rejected.
8. No application role can update or delete an audit event.
9. A private proof-of-delivery URL expires and cannot be reused indefinitely.
10. Server actions reject attempts to update fields outside their command contract.
