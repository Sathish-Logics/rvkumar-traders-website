// Renders the protected owner dashboard with live operational and financial summaries.
import {
  BellRing,
  ClipboardList,
  FileText,
  Package,
  ShoppingCart,
  Truck,
  WalletCards,
} from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireActiveAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardReport } from "@/services/operations.service";

export const dynamic = "force-dynamic";
export default async function AdminOverviewPage() {
  const admin = await requireActiveAdmin();
  const [report, products] = await Promise.all([
    getDashboardReport(),
    prisma.product.count(),
  ]);
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Operations dashboard</p>
              <h1>Business overview</h1>
            </div>
          </header>
          <section className="admin-summary-grid">
            <article>
              <div>
                <span>New enquiries</span>
                <ClipboardList />
              </div>
              <strong>{report.newEnquiries}</strong>
            </article>
            <article>
              <div>
                <span>Pending quotations</span>
                <FileText />
              </div>
              <strong>{report.pendingQuotes}</strong>
            </article>
            <article>
              <div>
                <span>Active orders</span>
                <ShoppingCart />
              </div>
              <strong>{report.confirmedOrders}</strong>
            </article>
            <article>
              <div>
                <span>Pending deliveries</span>
                <Truck />
              </div>
              <strong>{report.pendingDeliveries}</strong>
            </article>
            <article>
              <div>
                <span>Due follow-ups</span>
                <BellRing />
              </div>
              <strong>{report.followUps}</strong>
            </article>
            <article>
              <div>
                <span>Outstanding</span>
                <WalletCards />
              </div>
              <strong>₹{report.outstandingPayments.toLocaleString("en-IN")}</strong>
            </article>
            <article>
              <div>
                <span>Products</span>
                <Package />
              </div>
              <strong>{products}</strong>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
