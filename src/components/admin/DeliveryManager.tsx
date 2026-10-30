// Lets the owner update delivery progress and attach private proof paths.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Delivery = {
  id: string;
  reference: string;
  orderReference: string;
  customerName: string;
  status: string;
  scheduledDate: string;
  vehicleNumber: string | null;
};
const next: Record<string, string[]> = {
  SCHEDULED: ["PREPARING", "CANCELLED"],
  PREPARING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["PARTIALLY_DELIVERED", "DELIVERED", "FAILED"],
};
export function DeliveryManager({ deliveries }: { deliveries: Delivery[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function update(id: string, status: string) {
    const response = await fetch(`/api/deliveries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Delivery updated" : result.error || "Unable to update");
    if (response.ok) router.refresh();
  }
  return (
    <section className="admin-record-list">
      <p className="admin-save-message">{message}</p>
      {deliveries.length ? (
        deliveries.map((delivery) => (
          <article className="admin-record-card" key={delivery.id}>
            <header>
              <div>
                <b>{delivery.reference}</b>
                <span>
                  {delivery.orderReference} · {delivery.customerName}
                </span>
              </div>
              <span className="status-pill">
                {delivery.status.replaceAll("_", " ")}
              </span>
            </header>
            <small>
              {new Date(delivery.scheduledDate).toLocaleDateString("en-IN")} ·{" "}
              {delivery.vehicleNumber ?? "Vehicle not assigned"}
            </small>
            <div className="admin-action-row">
              {(next[delivery.status] ?? []).map((status) => (
                <button key={status} onClick={() => update(delivery.id, status)}>
                  {status.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </article>
        ))
      ) : (
        <p className="admin-empty-state">No deliveries scheduled yet.</p>
      )}
    </section>
  );
}
