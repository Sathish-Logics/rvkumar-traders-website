// Displays private quotation versions, values, and lifecycle states.
import { QuotationManager } from "@/components/admin/QuotationManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listQuotations } from "@/services/operations.service";
import { listEnquiries } from "@/services/enquiry.service";

export const dynamic = "force-dynamic";
export default async function QuotationsPage() {
  const admin = await requireActiveAdmin();
  const [records, enquiries] = await Promise.all([listQuotations(), listEnquiries()]);
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Commercial documents</p>
              <h1>Quotations</h1>
            </div>
          </header>
          <QuotationManager
            enquiries={enquiries.map((record) => ({
              id: record.id,
              reference: record.reference,
              customerName: record.customerName,
              items: record.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity.toString(),
                unit: item.unit,
              })),
            }))}
            quotations={records.map((record) => ({
              id: record.id,
              reference: record.reference,
              status: record.status,
              version: record.version,
              customerName: record.customer.name,
              grandTotal: record.grandTotal.toString(),
              location: record.enquiry.location,
              pinCode: record.enquiry.pinCode,
              hasOrder: Boolean(record.order),
            }))}
          />
        </div>
      </main>
    </div>
  );
}
