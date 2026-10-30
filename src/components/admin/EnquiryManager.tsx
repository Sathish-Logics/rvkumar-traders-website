// Lets the owner update lead stages, follow-ups, and internal notes from the dashboard.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Enquiry = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  location: string;
  status: string;
  followUpAt: string | null;
  itemSummary: string;
  createdAt: string;
};
const statuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTATION_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export function EnquiryManager({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function update(id: string, body: object) {
    setMessage("Saving…");
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    setMessage(response.ok ? "Saved" : result.error || "Unable to save");
    if (response.ok) router.refresh();
  }
  async function addNote(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/enquiries/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: form.get("note") }),
    });
    setMessage(response.ok ? "Note added" : "Unable to add note");
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  if (!enquiries.length)
    return <p className="admin-empty-state">No enquiries received yet.</p>;
  return (
    <section className="admin-record-list" aria-live="polite">
      {message ? <p className="admin-save-message">{message}</p> : null}
      {enquiries.map((enquiry) => (
        <article className="admin-record-card" key={enquiry.id}>
          <header>
            <div>
              <b>{enquiry.reference}</b>
              <span>
                {enquiry.customerName} · {enquiry.phone}
              </span>
            </div>
            <span className="status-pill">{enquiry.status.replaceAll("_", " ")}</span>
          </header>
          <p>{enquiry.itemSummary}</p>
          <small>
            {enquiry.location} ·{" "}
            {new Date(enquiry.createdAt).toLocaleDateString("en-IN")}
          </small>
          <div className="admin-control-grid">
            <label>
              Status
              <select
                value={enquiry.status}
                onChange={(event) => update(enquiry.id, { status: event.target.value })}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>
              Follow-up
              <input
                type="datetime-local"
                defaultValue={enquiry.followUpAt?.slice(0, 16) ?? ""}
                onBlur={(event) =>
                  update(enquiry.id, {
                    followUpAt: event.target.value
                      ? new Date(event.target.value).toISOString()
                      : null,
                  })
                }
              />
            </label>
          </div>
          <form
            className="admin-inline-form"
            onSubmit={(event) => addNote(event, enquiry.id)}
          >
            <input
              name="note"
              required
              maxLength={2000}
              placeholder="Add an internal note"
            />
            <button type="submit">Add note</button>
          </form>
        </article>
      ))}
    </section>
  );
}
