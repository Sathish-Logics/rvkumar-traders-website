// Displays manually recorded and reversed customer payments.
import { PaymentManager } from "@/components/admin/PaymentManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listOrders, listPayments } from "@/services/operations.service";

export const dynamic = "force-dynamic";
export default async function PaymentsPage() {
  const admin = await requireActiveAdmin();
  const [records, orders] = await Promise.all([listPayments(), listOrders()]);
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Manual reconciliation</p>
              <h1>Payments</h1>
            </div>
          </header>
          <PaymentManager
            orders={orders.map((record) => ({
              id: record.id,
              reference: record.reference,
              customerName: record.customer.name,
            }))}
            payments={records.map((record) => ({
              id: record.id,
              reference: record.reference,
              orderReference: record.order.reference,
              customerName: record.order.customer.name,
              amount: record.amount.toString(),
              method: record.method,
              status: record.status,
              receivedAt: record.receivedAt.toISOString(),
            }))}
          />
        </div>
      </main>
    </div>
  );
}
