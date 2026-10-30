// Lets the owner correct customer names and email addresses while preserving history.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  enquiryCount: number;
  lastEnquiry: string | null;
};
export function CustomerManager({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email") || null,
      }),
    });
    setMessage(response.ok ? "Customer updated" : "Unable to update customer");
    if (response.ok) router.refresh();
  }
  return (
    <section className="admin-record-list">
      <p className="admin-save-message">{message}</p>
      {customers.map((customer) => (
        <form
          className="admin-record-card"
          key={customer.id}
          onSubmit={(event) => save(event, customer.id)}
        >
          <div className="admin-control-grid">
            <label>
              Name
              <input name="name" defaultValue={customer.name} required />
            </label>
            <label>
              Phone
              <input value={customer.phone} disabled />
            </label>
            <label>
              Email
              <input name="email" type="email" defaultValue={customer.email ?? ""} />
            </label>
            <label>
              History
              <input
                value={`${customer.enquiryCount} enquiries · ${customer.lastEnquiry ?? "No reference"}`}
                disabled
              />
            </label>
          </div>
          <button type="submit">Save customer</button>
        </form>
      ))}
    </section>
  );
}
