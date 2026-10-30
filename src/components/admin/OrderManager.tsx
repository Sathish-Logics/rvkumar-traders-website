// Lets the owner progress orders and schedule deliveries without automatic decisions.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Order = {
  id: string;
  reference: string;
  customerName: string;
  status: string;
  total: string;
  address: string;
  pinCode: string;
};
const next: Record<string, string[]> = {
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["COMPLETED"],
};
export function OrderManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function update(order: Order, status: string) {
    const reason =
      status === "CANCELLED" ? window.prompt("Cancellation reason") : undefined;
    if (status === "CANCELLED" && !reason) return;
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Order updated" : result.error || "Unable to update");
    if (response.ok) router.refresh();
  }
  async function schedule(event: React.FormEvent<HTMLFormElement>, order: Order) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        scheduledDate: form.get("scheduledDate"),
        address: order.address,
        vehicleNumber: form.get("vehicleNumber") || null,
        driverName: form.get("driverName") || null,
        driverPhone: form.get("driverPhone") || null,
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? `Delivery ${result.reference} scheduled`
        : result.error || "Unable to schedule delivery",
    );
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  return (
    <section className="admin-record-list">
      <p className="admin-save-message">{message}</p>
      {orders.length ? (
        orders.map((order) => (
          <article className="admin-record-card" key={order.id}>
            <header>
              <div>
                <b>{order.reference}</b>
                <span>{order.customerName}</span>
              </div>
              <span className="status-pill">{order.status}</span>
            </header>
            <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
            <div className="admin-action-row">
              {(next[order.status] ?? []).map((status) => (
                <button key={status} onClick={() => update(order, status)}>
                  {status.replaceAll("_", " ")}
                </button>
              ))}
            </div>
            <form
              className="admin-inline-form admin-inline-form-wrap"
              onSubmit={(event) => schedule(event, order)}
            >
              <input type="date" name="scheduledDate" required />
              <input name="vehicleNumber" placeholder="Vehicle number" />
              <input name="driverName" placeholder="Driver name" />
              <input
                name="driverPhone"
                placeholder="Driver mobile"
                pattern="[6-9][0-9]{9}"
              />
              <button type="submit">Schedule delivery</button>
            </form>
          </article>
        ))
      ) : (
        <p className="admin-empty-state">No confirmed orders yet.</p>
      )}
    </section>
  );
}
