// Renders authenticated admin navigation and the owner sign-out control.
import Link from "next/link";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  ShoppingCart,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

export function Sidebar({
  displayName,
  isBypass = false,
}: {
  displayName: string;
  isBypass?: boolean;
}) {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-sidebar-brand">
        <span>RV</span>
        <div>
          <b>RVKumar</b>
          <small>Operations</small>
        </div>
      </Link>
      <nav aria-label="Admin navigation">
        <Link href="/admin">
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link href="/admin/enquiries">
          <ClipboardList size={18} /> Enquiries
        </Link>
        <Link href="/admin/customers">
          <Users size={18} /> Customers
        </Link>
        <Link href="/admin/products">
          <Package size={18} /> Products
        </Link>
        <Link href="/admin/quotations">
          <ReceiptText size={18} /> Quotations
        </Link>
        <Link href="/admin/orders">
          <ShoppingCart size={18} /> Orders
        </Link>
        <Link href="/admin/deliveries">
          <Truck size={18} /> Deliveries
        </Link>
        <Link href="/admin/payments">
          <WalletCards size={18} /> Payments
        </Link>
      </nav>
      {isBypass ? (
        <p className="admin-bypass-notice">Development access · Login bypassed</p>
      ) : null}
      <div className="admin-sidebar-user">
        <div>
          <small>Signed in as</small>
          <b>{displayName}</b>
        </div>
        <form action={logout}>
          <button type="submit" aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </aside>
  );
}
