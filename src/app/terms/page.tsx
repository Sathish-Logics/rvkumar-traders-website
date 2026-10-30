// Renders the editable business-terms placeholder page for the public website.
import Link from "next/link";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";

export const metadata = {
  title: "Terms",
  robots: { index: false, follow: true },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <div className="container">
          <Link href="/" className="text-link">
            ← Back to home
          </Link>
          <span className="section-kicker">Business information</span>
          <h1>Terms and conditions</h1>
          <p>
            This page is a launch placeholder. Final quotation, payment, delivery,
            cancellation and website-use terms will be added only after approval by
            RVKumar Traders.
          </p>
          <p>
            Submitting a quotation enquiry does not create an order or guarantee product
            availability or delivery.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
