// Lets the owner price enquiries, transition quotations, export PDFs, and create orders.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Enquiry = {
  id: string;
  reference: string;
  customerName: string;
  items: { productId: string; productName: string; quantity: string; unit: string }[];
};
type Quote = {
  id: string;
  reference: string;
  status: string;
  version: number;
  customerName: string;
  grandTotal: string;
  location: string;
  pinCode: string;
  hasOrder: boolean;
};

export function QuotationManager({
  enquiries,
  quotations,
}: {
  enquiries: Enquiry[];
  quotations: Quote[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(enquiries[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const selected = enquiries.find((item) => item.id === selectedId);
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const items = selected.items.map((item, index) => ({
      productId: item.productId,
      description: item.productName,
      quantity: Number(item.quantity),
      unit: item.unit,
      unitRate: Number(form.get(`rate-${index}`)),
      taxRate: Number(form.get(`tax-${index}`)),
    }));
    const response = await fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enquiryId: selected.id,
        items,
        transportationCharge: Number(form.get("transportationCharge")),
        discountAmount: Number(form.get("discountAmount")),
        validUntil: form.get("validUntil") || null,
        paymentTerms: form.get("paymentTerms") || null,
        deliveryTerms: form.get("deliveryTerms") || null,
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? `Created ${result.reference}`
        : result.error || "Unable to create quotation",
    );
    if (response.ok) router.refresh();
  }
  async function decide(id: string, action: string) {
    const response = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Quotation updated" : result.error || "Unable to update");
    if (response.ok) router.refresh();
  }
  async function createOrder(quote: Quote) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: quote.id,
        address: quote.location,
        pinCode: quote.pinCode,
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? `Order ${result.reference} created`
        : result.error || "Unable to create order",
    );
    if (response.ok) router.refresh();
  }
  return (
    <>
      <form className="admin-editor-panel" onSubmit={create}>
        <h2>Create quotation</h2>
        <label>
          Enquiry
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            required
          >
            {enquiries.map((enquiry) => (
              <option value={enquiry.id} key={enquiry.id}>
                {enquiry.reference} · {enquiry.customerName}
              </option>
            ))}
          </select>
        </label>
        {selected?.items.map((item, index) => (
          <div className="admin-line-editor" key={item.productId}>
            <b>{item.productName}</b>
            <span>
              {item.quantity} {item.unit}
            </span>
            <label>
              Unit rate
              <input
                name={`rate-${index}`}
                type="number"
                min="0"
                step="0.01"
                required
              />
            </label>
            <label>
              GST %
              <input
                name={`tax-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue="0"
                required
              />
            </label>
          </div>
        ))}
        <div className="admin-control-grid">
          <label>
            Transport
            <input
              name="transportationCharge"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </label>
          <label>
            Discount
            <input
              name="discountAmount"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </label>
          <label>
            Valid until
            <input name="validUntil" type="date" />
          </label>
          <label>
            Payment terms
            <input name="paymentTerms" />
          </label>
          <label className="admin-field-wide">
            Delivery terms
            <input name="deliveryTerms" />
          </label>
        </div>
        <button type="submit" disabled={!selected}>
          Create draft
        </button>
        <span>{message}</span>
      </form>
      <section className="admin-record-list">
        {quotations.map((quote) => (
          <article className="admin-record-card" key={quote.id}>
            <header>
              <div>
                <b>
                  {quote.reference} · v{quote.version}
                </b>
                <span>{quote.customerName}</span>
              </div>
              <span className="status-pill">{quote.status}</span>
            </header>
            <strong>₹{Number(quote.grandTotal).toLocaleString("en-IN")}</strong>
            <div className="admin-action-row">
              {quote.status === "DRAFT" ? (
                <button onClick={() => decide(quote.id, "ISSUE")}>Issue</button>
              ) : null}
              {quote.status === "ISSUED" ? (
                <>
                  <button onClick={() => decide(quote.id, "ACCEPT")}>Accept</button>
                  <button onClick={() => decide(quote.id, "REJECT")}>Reject</button>
                </>
              ) : null}
              {quote.status === "ACCEPTED" && !quote.hasOrder ? (
                <button onClick={() => createOrder(quote)}>Create order</button>
              ) : null}
              <a href={`/api/quotations/${quote.id}/pdf`}>Download PDF</a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
