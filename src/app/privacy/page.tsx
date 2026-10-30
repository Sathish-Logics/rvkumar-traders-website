// Renders the editable privacy-notice placeholder page for the public website.
import Link from "next/link";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";

export const metadata = {
  title: "Privacy notice",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <div className="container">
          <Link href="/" className="text-link">
            ← Back to home
          </Link>
          <span className="section-kicker">Customer information</span>
          <h1>Privacy notice</h1>
          <p>
            This page is a launch placeholder. The final notice will explain what
            enquiry information RVKumar Traders collects, why it is needed, how it is
            protected, and how customers can request assistance.
          </p>
          <p>
            The enquiry form collects only the information required to review a material
            request. The final approved privacy notice must be published before
            production launch.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
