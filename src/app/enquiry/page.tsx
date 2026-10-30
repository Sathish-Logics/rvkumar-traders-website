// Renders the public multi-product quotation enquiry page backed by live products.
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";
import { listPublishedProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Request a Quotation",
  description:
    "Send a multi-product construction material quotation enquiry to RVKumar Traders.",
  alternates: { canonical: "/enquiry" },
};

export default async function EnquiryPage() {
  const products = await listPublishedProducts();
  return (
    <>
      <SiteHeader />
      <main className="form-page">
        <div className="container form-page-grid">
          <header className="page-intro">
            <span className="section-kicker">Quotation enquiry</span>
            <h1>Tell us what your project needs.</h1>
            <p>
              Select materials, quantities and the delivery location. This request does
              not create an order.
            </p>
          </header>
          <EnquiryForm
            products={products.map(({ id, name, unit }) => ({
              id,
              name,
              unit,
            }))}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
