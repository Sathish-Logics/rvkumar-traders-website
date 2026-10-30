// Displays scheduled and completed deliveries with transport details.
import { DeliveryManager } from "@/components/admin/DeliveryManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listDeliveries } from "@/services/operations.service";

export const dynamic = "force-dynamic";
export default async function DeliveriesPage() {
  const admin = await requireActiveAdmin();
  const records = await listDeliveries();
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Delivery management</p>
              <h1>Deliveries</h1>
            </div>
          </header>
          <DeliveryManager
            deliveries={records.map((record) => ({
              id: record.id,
              reference: record.reference,
              orderReference: record.order.reference,
              customerName: record.order.customer.name,
              status: record.status,
              scheduledDate: record.scheduledDate.toISOString(),
              vehicleNumber: record.vehicleNumber,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
