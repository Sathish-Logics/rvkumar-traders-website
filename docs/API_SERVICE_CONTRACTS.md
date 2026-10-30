# API and Service Contracts

**Version:** 0.2  
**Status:** MVP foundation partially implemented  
**Last updated:** 28 October 2026

## 0. Current implemented endpoints

The current MVP uses the following live route handlers. Admin endpoints require the
owner authorization guard; the local-only login bypass does not apply in production.

| Method      | Route                              | Purpose                                        |
| ----------- | ---------------------------------- | ---------------------------------------------- |
| `POST`      | `/api/enquiries`                   | Validate and create a multi-product enquiry    |
| `GET`       | `/api/enquiries`                   | List enquiries for the owner                   |
| `GET`       | `/api/enquiries/:id`               | Read one enquiry and its activity timeline     |
| `PATCH`     | `/api/enquiries/:id`               | Update status and/or follow-up date            |
| `POST`      | `/api/enquiries/:id/notes`         | Add an owner note to the activity timeline     |
| `GET`       | `/api/customers`                   | Search/list deduplicated customer records      |
| `GET`       | `/api/customers/:id`               | Read a customer with enquiry history           |
| `GET`       | `/api/products`                    | List the owner product catalogue               |
| `POST`      | `/api/products`                    | Create a catalogue product                     |
| `PATCH`     | `/api/products/:id`                | Update a catalogue product                     |
| `GET/POST`  | `/api/quotations`                  | List or create private quotation drafts        |
| `GET/PATCH` | `/api/quotations/:id`              | Read or transition a quotation                 |
| `GET`       | `/api/quotations/:id/pdf`          | Export an owner-authorized quotation PDF       |
| `GET/POST`  | `/api/orders`                      | List or create an order from an accepted quote |
| `PATCH`     | `/api/orders/:id`                  | Apply a valid order transition                 |
| `GET/POST`  | `/api/deliveries`                  | List or schedule deliveries                    |
| `PATCH`     | `/api/deliveries/:id`              | Apply a valid delivery transition              |
| `POST`      | `/api/deliveries/:id/proof-upload` | Prepare a private proof upload                 |
| `GET/POST`  | `/api/payments`                    | List or manually record payments               |
| `PATCH`     | `/api/payments/:id`                | Reverse a payment with a reason                |
| `GET`       | `/api/reports/dashboard`           | Return protected operational metrics           |
| `POST`      | `/api/cron/notifications`          | Process queued notifications                   |

Creating an enquiry normalizes the phone number, upserts the customer, stores enquiry
items, allocates the enquiry reference, adds a `CREATED` activity, and writes the audit
event in one database transaction. No price or order is created.

## 1. Contract strategy

Most admin mutations will use typed server actions calling application services. Route handlers are used for public submissions, file/document delivery, provider webhooks, and integrations. The domain contracts below remain stable regardless of transport.

Every mutation returns a discriminated result:

```ts
type Result<T> =
  | { ok: true; data: T; requestId: string }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
      requestId: string;
    };
```

User-facing messages must not expose stack traces, SQL details, provider secrets, or whether unrelated customer records exist.

## 2. Public HTTP contracts

### `POST /api/public/enquiries`

Purpose: create a customer quotation enquiry.

Request shape:

```ts
{
  idempotencyKey: string
  customer: {
    name: string
    mobile: string
    email?: string
    customerType?: "home_owner" | "engineer" | "contractor" |
      "construction_company" | "developer" | "builder" | "other"
  }
  items: Array<{
    productId?: string
    description?: string
    quantity: string
    unitId: string
    notes?: string
  }>
  delivery: {
    addressLine: string
    locality: string
    district?: string
    state: string
    pinCode: string
    preferredDate?: string
  }
  instructions?: string
  consent: {
    enquiryContact: true
    noticeVersion: string
  }
  attribution?: {
    source?: string
    medium?: string
    campaign?: string
    landingPath?: string
  }
  botToken?: string
}
```

Success: HTTP `201` for first creation or `200` for an idempotent replay. Returns the human reference, confirmation token/path, acknowledgement-channel states, and request ID. It never returns internal customer, lead, pricing, or admin fields.

Validation includes at least one and no more than the configured maximum items, positive quantities, allowed product/unit relationship, Indian mobile normalization, PIN format, bounded text lengths, consent, origin, rate limit, and bot signal.

### `GET /api/public/catalogue`

Optional endpoint for interactive public components. Returns published categories/products and allowed specifications only. Server-rendered pages should prefer direct server queries. Cache behavior supports revalidation after catalogue publication changes.

### `GET /api/documents/quotations/:token`

Only introduced if customer document links are required. Token is high entropy, scoped to one document, revocable, and expiring. Response uses safe content disposition and does not reveal storage paths.

### Provider webhooks

`POST /api/webhooks/email/:provider` and `POST /api/webhooks/sms/:provider` verify signatures against raw request bodies, reject replays where supported, map provider IDs to outbox records, and never trust provider-supplied business entity IDs without lookup.

## 3. Catalogue services

```ts
listPublishedCatalogue(query);
getPublishedProductBySlug(slug);
createProduct(command, actor);
updateProduct(command, actor);
setProductPublication(command, actor);
setProductAvailability(command, actor);
recordPriceEntry(command, actor);
```

Publication verifies required name, slug, category, supported units, copy, and imagery/alt-text rules. Internal prices never appear in public DTOs.

## 4. Enquiry services

```ts
submitEnquiry(command, context);
getEnquiry(id, actor);
searchEnquiries(query, actor);
updateEnquiryClassification(command, actor);
```

`submitEnquiry` owns normalization, duplicate-customer matching, reference allocation, enquiry/line creation, lead creation, consent capture, audit/activity creation, and notification-outbox insertion in one transaction.

## 5. Lead services

```ts
searchLeads(filters, pagination, actor);
getLeadWorkspace(leadId, actor);
transitionLead(command, actor);
addLeadNote(command, actor);
scheduleFollowUp(command, actor);
completeFollowUp(command, actor);
```

### Allowed lead transitions

```text
New -> Contacted | Lost
Contacted -> Qualified | Lost
Qualified -> Quotation Sent | Lost
Quotation Sent -> Negotiation | Won | Lost
Negotiation -> Quotation Sent | Won | Lost
Won -> no ordinary transition
Lost -> Contacted only through reopen with reason
```

Issuing a quotation may move a qualified lead to `Quotation Sent`. Accepting a quotation may move it to `Won`, but both changes are audited as related operations.

## 6. Customer services

```ts
searchCustomers(query, actor);
getCustomerWorkspace(customerId, actor);
updateCustomer(command, actor);
addCustomerAddress(command, actor);
suggestCustomerMatches(input, actor);
mergeCustomers(command, actor); // deferred unless needed
archiveCustomer(command, actor);
```

Customer matching suggests possible duplicates; it must not silently merge records.

## 7. Quotation services

```ts
createQuotationDraft(command, actor);
updateQuotationDraft(command, actor);
calculateQuotationPreview(command, actor);
issueQuotation(command, actor);
createQuotationRevision(command, actor);
recordQuotationDecision(command, actor);
generateQuotationPdf(command, actor);
expireEligibleQuotations(context);
```

### Quotation state rules

```text
Draft -> Issued
Issued -> Accepted | Rejected | Expired | Superseded
Issued -> Superseded when a revision is issued
Accepted -> order conversion allowed once
```

- Only drafts may be edited.
- Issuing stores calculation inputs/outputs, policy version, terms, business/customer snapshots, and issuer.
- A revision copies the previous issued version into a new draft and increments the version number only when issued.
- Acceptance records method, time, actor, note, and optional evidence.
- Expiry does not erase or invalidate historical documents.

## 8. Order services

```ts
convertAcceptedQuotationToOrder(command, actor);
getOrderWorkspace(orderId, actor);
searchOrders(filters, pagination, actor);
transitionOrder(command, actor);
cancelOrder(command, actor);
```

### Order state rules

```text
Confirmed -> Preparing | Cancelled
Preparing -> Dispatched | Cancelled
Dispatched -> Delivered | Cancelled with exceptional reason
Delivered -> Completed
```

For partial deliveries, the order may remain `Preparing` or `Dispatched` according to operational state. `Delivered` requires all required quantities fulfilled or an audited short-close decision. `Completed` additionally requires owner confirmation; payment may remain outstanding and is shown separately rather than hidden in the order status.

## 9. Delivery services

```ts
createDelivery(command, actor);
updateScheduledDelivery(command, actor);
dispatchDelivery(command, actor);
recordDeliveryOutcome(command, actor);
attachProofOfDelivery(command, actor);
```

### Delivery states

```text
Scheduled -> Preparing -> Dispatched -> Delivered
Scheduled | Preparing -> Cancelled
Dispatched -> Failed | Partially Delivered | Delivered
Failed | Partially Delivered -> reschedule through a new delivery record
```

Delivered quantities are checked transactionally against order-line remaining quantities.

## 10. Payment services

```ts
recordPayment(command, actor);
updatePaymentMetadata(command, actor);
reversePayment(command, actor);
getOrderPaymentSummary(orderId, actor);
searchOutstandingBalances(filters, actor);
```

Payment amount and received date cannot be silently changed after confirmation. A correction uses reversal plus a new payment when financially material. Every reversal requires a reason.

Derived status:

```text
Unpaid: received = 0
Partially Paid: 0 < received < order total
Paid: received = order total
Overpaid: received > order total, highlighted for resolution
```

## 11. Notification services

```ts
queueNotification(command, transaction);
processNotificationOutbox(batchOptions);
retryNotification(command, actor);
buildWhatsAppShareLink(context);
```

Destinations are normalized and protected. Templates receive allowlisted data rather than arbitrary database objects. Retry uses exponential backoff, maximum attempts, and idempotency keys.

## 12. Reporting services

```ts
getDashboardSummary(dateRange, actor);
getSalesFunnel(dateRange, actor);
getFollowUpWorkQueue(filters, actor);
getDeliveryWorkQueue(filters, actor);
getOutstandingBalanceReport(filters, actor);
```

Reports define whether they measure enquiry-created, quotation-issued, order-confirmed, delivered, or payment-received dates. They default to excluding demo data and cancelled/reversed records as appropriate.

## 13. Audit service

```ts
appendAuditEvent(event, transaction);
listEntityAuditTrail(entity, pagination, actor);
searchAuditEvents(filters, actor);
```

Stable action codes include:

```text
enquiry.created
lead.stage_changed
lead.note_added
follow_up.scheduled
quotation.issued
quotation.revised
quotation.accepted
quotation.rejected
order.created
order.status_changed
order.cancelled
delivery.dispatched
delivery.completed
payment.recorded
payment.reversed
product.published
product.unpublished
settings.changed
admin.login_succeeded
admin.login_failed
```

Audit writes participate in the same transaction as the business mutation whenever possible. Audit listing redacts fields based on viewer permission.

## 14. Pagination, filtering, and concurrency

- List contracts use cursor pagination for growing operational datasets.
- Filters are allowlisted and validated; arbitrary column/sort input is rejected.
- Detail mutations include an expected version or `updatedAt` value for optimistic concurrency.
- Stale writes return `CONFLICT` and ask the owner to reload instead of overwriting newer work.
- Search input is length-limited, normalized, and parameterized.

## 15. Error codes

Initial stable codes:

```text
VALIDATION_FAILED
AUTHENTICATION_REQUIRED
PERMISSION_DENIED
NOT_FOUND
CONFLICT
INVALID_STATE_TRANSITION
DUPLICATE_SUBMISSION
RATE_LIMITED
UPLOAD_REJECTED
PROVIDER_UNAVAILABLE
INTERNAL_ERROR
```

Provider outages affecting acknowledgements return a successful enquiry creation with notification state `pending` or `failed`; they do not misreport the enquiry as lost.

## 16. Service contract acceptance tests

- Same enquiry idempotency key produces one enquiry and one lead.
- Invalid product/unit pairing is rejected.
- Public catalogue DTO contains no price or internal-note fields.
- Issued quotation update is rejected.
- Two concurrent order conversions produce one order.
- Partial delivery cannot exceed remaining quantity.
- Payment reversal changes balance and creates an audit event.
- Notification provider failure preserves the committed enquiry.
- Unauthorized service invocation is rejected before data access.
- Stale admin update produces a conflict instead of lost data.
