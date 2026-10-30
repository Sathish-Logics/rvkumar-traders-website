// Lists every published construction material available for quotation enquiry.
import type { Metadata } from "next";
import { SiteFooter } from "@/components/Footer";
import { ProductCatalogue } from "@/components/ProductCatalogue";
import { SiteHeader } from "@/components/Header";
import { listPublishedProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Construction Materials",
  description:
    "Browse cement, TMT steel, sand, bricks, aggregates, lime and waterproofing materials available from RVKumar Traders.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await listPublishedProducts();
  return (
    <>
      <SiteHeader />
      <main className="catalogue-page">
        <div className="container">
          <header className="page-intro">
            <span className="section-kicker">Product catalogue</span>
            <h1>Construction materials for your project.</h1>
            <p>
              Choose a material to review its details or add it to a quotation enquiry.
              Commercial details are shared after requirement review.
            </p>
          </header>
          <ProductCatalogue products={products} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
