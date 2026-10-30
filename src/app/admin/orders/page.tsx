// Displays confirmed orders, delivery progress, and payment balance.
import { OrderManager } from "@/components/admin/OrderManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listOrders } from "@/services/operations.service";

export const dynamic = "force-dynamic";
export default async function OrdersPage() {
  const admin = await requireActiveAdmin();
  const records = await listOrders();
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Order management</p>
              <h1>Orders</h1>
            </div>
          </header>
          <OrderManager
            orders={records.map((record) => ({
              id: record.id,
              reference: record.reference,
              customerName: record.customer.name,
              status: record.status,
              total: record.totalAmount.toString(),
              address: record.address,
              pinCode: record.pinCode,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
