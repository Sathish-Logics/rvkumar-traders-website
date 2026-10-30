// Renders the protected enquiry-management table using live Prisma records.
import { EnquiryManager } from "@/components/admin/EnquiryManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listEnquiries } from "@/services/enquiry.service";

export const dynamic = "force-dynamic";
export default async function AdminEnquiriesPage() {
  const admin = await requireActiveAdmin();
  const records = await listEnquiries();
  const enquiries = records.map((record) => ({
    id: record.id,
    reference: record.reference,
    customerName: record.customerName,
    phone: record.phone,
    location: record.location,
    status: record.status,
    followUpAt: record.followUpAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    itemSummary: record.items
      .map((item) => `${item.productName} — ${item.quantity.toString()} ${item.unit}`)
      .join(", "),
  }));
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Lead management</p>
              <h1>Enquiries</h1>
            </div>
          </header>
          <EnquiryManager enquiries={enquiries} />
        </div>
      </main>
    </div>
  );
}
