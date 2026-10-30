// Renders verified business-location information and directs visitors to enquiries.
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";
import { publicContact, whatsappEnquiryUrl } from "@/lib/public-contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact RVKumar Traders in Aathipatti, Aruppukottai Taluk for construction material enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappUrl = whatsappEnquiryUrl(
    "Hello RVKumar Traders, I would like to enquire about construction materials.",
  );

  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <div className="container">
          <header className="page-intro">
            <span className="section-kicker">Contact RVKumar Traders</span>
            <h1>Send your material requirement.</h1>
            <p>
              Share the materials, quantity and delivery location through the quotation
              workflow. Verified contact methods appear here when configured.
            </p>
          </header>
          <div className="contact-card">
            <MapPin />
            <div>
              <b>Aathipatti</b>
              <p>Aruppukottai Taluk, Virudhunagar District, Tamil Nadu – 626101</p>
            </div>
          </div>
          <div className="contact-actions">
            <Link href="/enquiry" className="button button-large">
              Request quotation
            </Link>
            {whatsappUrl ? (
              <a
                className="button button-large button-secondary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp enquiry
              </a>
            ) : null}
            {publicContact.phone ? (
              <a href={`tel:${publicContact.phone}`}>{publicContact.phone}</a>
            ) : null}
            {publicContact.email ? (
              <a href={`mailto:${publicContact.email}`}>{publicContact.email}</a>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
