// Explains RVKumar Traders services, location and enquiry-first operating process.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, Truck } from "lucide-react";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";

export const metadata: Metadata = {
  title: "About RVKumar Traders",
  description:
    "Learn about RVKumar Traders, a construction-material enquiry and supply business based in Aathipatti, Aruppukottai Taluk, serving reviewed requirements around Virudhunagar and Madurai.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <section className="about-hero">
          <div className="container about-grid">
            <div>
              <span className="section-kicker">About RVKumar Traders</span>
              <h1>
                Construction-material enquiries coordinated around real project needs.
              </h1>
              <p>
                RVKumar Traders is based in Aathipatti, Aruppukottai Taluk. Customers
                can send one requirement covering multiple materials, delivery
                information and preferred timing for review before a quotation is
                prepared.
              </p>
              <Link href="/enquiry" className="button button-large">
                Request a quotation <ArrowRight size={18} />
              </Link>
            </div>
            <div className="about-image">
              <Image
                src="/media/rvkumar-lorry-service-poster.webp"
                alt="RVKumar Traders construction material transport lorry"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
          </div>
        </section>
        <section className="section about-principles">
          <div className="container about-principles-grid">
            <article>
              <PackageCheck aria-hidden="true" />
              <h2>Multiple requirements</h2>
              <p>
                Cement, steel, sand, bricks and related materials can be requested
                together.
              </p>
            </article>
            <article>
              <Truck aria-hidden="true" />
              <h2>Conditional delivery</h2>
              <p>
                Transport and delivery are confirmed after quantity and destination
                review.
              </p>
            </article>
            <article>
              <MapPin aria-hidden="true" />
              <h2>Local coordination</h2>
              <p>
                Enquiries focus on Aathipatti, Aruppukottai Taluk and reviewed
                surrounding service areas.
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
