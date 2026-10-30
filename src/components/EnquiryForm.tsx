// Renders and submits the interactive multi-product public quotation enquiry form.
"use client";

import { FormEvent, useState } from "react";

type EnquiryProduct = { id: string; name: string; unit: string };

export function EnquiryForm({ products }: { products: EnquiryProduct[] }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const items = products.flatMap((product) => {
      if (data.get(`selected-${product.id}`) !== "on") return [];
      return [
        {
          productId: product.id,
          quantity: Number(data.get(`quantity-${product.id}`)),
          unit: String(data.get(`unit-${product.id}`) || product.unit),
        },
      ];
    });

    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: data.get("customerName"),
        phone: data.get("phone"),
        email: data.get("email"),
        location: data.get("location"),
        pinCode: data.get("pinCode"),
        preferredDate: data.get("preferredDate"),
        instructions: data.get("instructions"),
        items,
      }),
    });
    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setMessage(result.error ?? "Unable to submit the enquiry.");
      return;
    }

    form.reset();
    setMessage(`Enquiry received. Reference: ${result.reference}`);
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <fieldset>
        <legend>Select materials</legend>
        <div className="enquiry-product-list">
          {products.map((product) => (
            <div className="enquiry-product-row" key={product.id}>
              <label className="enquiry-product-choice">
                <input type="checkbox" name={`selected-${product.id}`} />
                <span>{product.name}</span>
              </label>
              <input
                aria-label={`${product.name} quantity`}
                className="enquiry-quantity-input"
                name={`quantity-${product.id}`}
                type="number"
                min="0.001"
                step="0.001"
                placeholder="Quantity"
              />
              <input
                className="enquiry-unit-input"
                name={`unit-${product.id}`}
                defaultValue={product.unit}
                aria-label={`${product.name} unit`}
              />
            </div>
          ))}
        </div>
      </fieldset>
      <div className="form-grid">
        <label>
          Name
          <input name="customerName" required minLength={2} />
        </label>
        <label>
          Mobile number
          <input name="phone" inputMode="numeric" required pattern="[6-9][0-9]{9}" />
        </label>
        <label>
          Email (optional)
          <input name="email" type="email" />
        </label>
        <label>
          Delivery location
          <input name="location" required />
        </label>
        <label>
          PIN code
          <input name="pinCode" inputMode="numeric" required pattern="[0-9]{6}" />
        </label>
        <label>
          Preferred delivery date
          <input name="preferredDate" type="date" />
        </label>
      </div>
      <label>
        Special instructions
        <textarea name="instructions" rows={4} />
      </label>
      <p className="form-note">
        Submitting this form creates an enquiry, not an order.
      </p>
      <button className="button button-large" disabled={submitting} type="submit">
        {submitting ? "Submitting…" : "Submit enquiry"}
      </button>
      {message ? (
        <p className="form-response" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
