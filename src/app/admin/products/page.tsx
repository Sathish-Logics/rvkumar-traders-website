// Renders the protected product catalogue management overview.
import { Sidebar } from "@/components/admin/Sidebar";
import { ProductManager } from "@/components/admin/ProductManager";
import { requireActiveAdmin } from "@/lib/auth";
import { listAllProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";
export default async function AdminProductsPage() {
  const admin = await requireActiveAdmin();
  const products = await listAllProducts();
  return (
    <div className="admin-shell">
      <Sidebar displayName={admin.displayName} isBypass={admin.isBypass} />
      <main className="admin-main">
        <div className="admin-dashboard">
          <header className="admin-page-header">
            <div>
              <p>Catalogue management</p>
              <h1>Products</h1>
            </div>
          </header>
          <ProductManager products={products} />
        </div>
      </main>
    </div>
  );
}
