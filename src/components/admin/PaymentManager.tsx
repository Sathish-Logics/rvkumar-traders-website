// Lets the owner record manual payments and reverse mistakes with a reason.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Order = { id: string; reference: string; customerName: string };
type Payment = {
  id: string;
  reference: string;
  orderReference: string;
  customerName: string;
  amount: string;
  method: string;
  status: string;
  receivedAt: string;
};
export function PaymentManager({
  orders,
  payments,
}: {
  orders: Order[];
  payments: Payment[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: form.get("orderId"),
        amount: Number(form.get("amount")),
        method: form.get("method"),
        receivedAt: new Date(String(form.get("receivedAt"))).toISOString(),
        externalRef: form.get("externalRef") || null,
        note: form.get("note") || null,
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? `Payment ${result.reference} recorded`
        : result.error || "Unable to record payment",
    );
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  async function reverse(id: string) {
    const reason = window.prompt("Why is this payment being reversed?");
    if (!reason) return;
    const response = await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setMessage(response.ok ? "Payment reversed" : "Unable to reverse payment");
    if (response.ok) router.refresh();
  }
  return (
    <>
      <form className="admin-editor-panel" onSubmit={create}>
        <h2>Record payment</h2>
        <div className="admin-control-grid">
          <label>
            Order
            <select name="orderId" required>
              {orders.map((order) => (
                <option value={order.id} key={order.id}>
                  {order.reference} · {order.customerName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input name="amount" type="number" min="0.01" step="0.01" required />
          </label>
          <label>
            Method
            <select name="method">
              <option>CASH</option>
              <option>BANK_TRANSFER</option>
              <option>UPI</option>
              <option>CHEQUE</option>
              <option>OTHER</option>
            </select>
          </label>
          <label>
            Received
            <input name="receivedAt" type="datetime-local" required />
          </label>
          <label>
            Reference
            <input name="externalRef" />
          </label>
          <label>
            Note
            <input name="note" />
          </label>
        </div>
        <button type="submit" disabled={!orders.length}>
          Record payment
        </button>
        <span>{message}</span>
      </form>
      <section className="admin-record-list">
        {payments.map((payment) => (
          <article className="admin-record-card" key={payment.id}>
            <header>
              <div>
                <b>{payment.reference}</b>
                <span>
                  {payment.orderReference} · {payment.customerName}
                </span>
              </div>
              <span className="status-pill">{payment.status}</span>
            </header>
            <strong>₹{Number(payment.amount).toLocaleString("en-IN")}</strong>
            <small>
              {payment.method.replaceAll("_", " ")} ·{" "}
              {new Date(payment.receivedAt).toLocaleDateString("en-IN")}
            </small>
            {payment.status === "RECORDED" ? (
              <div className="admin-action-row">
                <button onClick={() => reverse(payment.id)}>Reverse</button>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </>
  );
}
