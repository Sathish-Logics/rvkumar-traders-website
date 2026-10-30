// Displays deduplicated customer records and enquiry counts for the owner.
import { CustomerManager } from "@/components/admin/CustomerManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { listCustomers } from "@/services/enquiry.service";

export const dynamic = "force-dynamic";
export default async function CustomersPage() {
  const admin = await requireActiveAdmin();
  const records = await listCustomers();
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Customer records</p>
              <h1>Customers</h1>
            </div>
          </header>
          <CustomerManager
            customers={records.map((record) => ({
              id: record.id,
              name: record.name,
              phone: record.phone,
              email: record.email,
              enquiryCount: record._count.enquiries,
              lastEnquiry: record.enquiries[0]?.reference ?? null,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
