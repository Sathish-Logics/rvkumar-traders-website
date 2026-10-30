// Renders the public RVKumar Traders homepage and its product/service sections.
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  ClipboardList,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";
import { InteractiveProductCard } from "@/components/InteractiveProductCard";
import { publicContact, whatsappEnquiryUrl } from "@/lib/public-contact";

const products = [
  {
    name: "UltraTech Cement",
    detail: "Cement for building and concrete work",
    image: "/images/products/ultratech-cement-owner-v2.webp",
    alt: "UltraTech Cement product bag",
    brand: "UltraTech",
    schemaType: "Product",
    imageClass: "product-image--contain",
  },
  {
    name: "TMT Steel",
    detail: "Agni Steel · TSRM Steel",
    image: "/images/products/tmt-steel-owner-v2.webp",
    alt: "TMT reinforcement bar held firmly against an orange background",
    brand: "Agni Steel",
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "M-Sand & P-Sand",
    detail: "Sand for concrete, masonry and plastering",
    image: "/images/products/sand-owner-v2.webp",
    alt: "Side-by-side visual comparison of M-Sand and river sand",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Bricks",
    detail: "Bricks for structural and masonry work",
    image: "/images/products/bricks-stones-restored-v3.webp",
    alt: "Neatly stacked red construction bricks",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Gravel (Keraval)",
    detail: "Gravel for filling, drainage and site preparation",
    image: "/images/products/keraval-gravel.webp",
    alt: "Warm-toned construction gravel in a material supply yard",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Crushed Stone Aggregate",
    detail: "Sali Kaal · Jelly stone for concrete and foundation work",
    image: "/images/products/sali-kaal.webp",
    alt: "Angular crushed granite stone aggregate for construction",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Construction Lime",
    detail: "Chunambu for masonry, plastering and finishing work",
    image: "/images/products/construction-lime-v3.webp",
    alt: "Open sack of white construction lime with a powder mound and masonry trowel",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Waterproofing Materials",
    detail: "Protective coatings and moisture-control solutions",
    image: "/images/products/waterproofing.webp",
    alt: "Waterproof coating being applied to a concrete surface",
    brand: undefined,
    schemaType: "Product",
    imageClass: "",
  },
  {
    name: "Earthmoving Services",
    detail: "Earthmoving · Excavation · Site work",
    image: "/images/products/earthmover-owner-v2.webp",
    alt: "Tracked excavator carrying out earthmoving work at sunset",
    brand: undefined,
    schemaType: "Service",
    imageClass: "",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Choose one or more materials and share quantities, delivery location and preferred date.",
  },
  {
    number: "02",
    title: "We review your enquiry",
    text: "The requirement is checked before current commercial and delivery details are discussed.",
  },
  {
    number: "03",
    title: "Receive your quotation",
    text: "A clear quotation is prepared with the applicable material, transport and tax details.",
  },
  {
    number: "04",
    title: "Confirm and schedule",
    text: "After your approval, the order and delivery are planned with you.",
  },
];

const faqs = [
  {
    q: "Can I request several materials together?",
    a: "Yes. The quotation request is designed for multi-material requirements, so you can add cement, steel, sand, bricks and other items in one enquiry.",
  },
  {
    q: "Why are prices not shown on the website?",
    a: "Material and delivery conditions can change. We first review the exact product, quantity and delivery location, then share the applicable details through a quotation.",
  },
  {
    q: "Does submitting an enquiry confirm an order?",
    a: "No. An enquiry only asks us to review your requirement. An order is created only after a quotation is accepted and separately confirmed.",
  },
  {
    q: "Which locations do you serve?",
    a: "The current website focuses on enquiries around Aathipatti, Aruppukottai Taluk, Virudhunagar District and Madurai. Exact delivery availability is confirmed after reviewing the destination.",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Construction Materials Supplier in Aruppukottai",
  description:
    "Request a quotation from RVKumar Traders for cement, TMT steel, M-Sand, P-Sand, bricks, aggregates, lime, waterproofing materials, lorry delivery and earthmoving services around Aruppukottai.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "RVKumar Traders | Construction Materials in Aruppukottai",
    description:
      "Send one multi-material enquiry for construction supplies, delivery review and earthmoving services.",
    url: "/",
    images: [
      {
        url: "/images/golden-hour-construction-hero.webp",
        width: 1672,
        height: 941,
        alt: "Multi-storey concrete building under construction with tower cranes at golden hour",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "RVKumar Traders",
      url: siteUrl,
      logo: `${siteUrl}/images/rv-kumar-traders-logo-transparent.webp`,
      description:
        "Construction materials supplier accepting quotation enquiries for cement, steel, sand, bricks, aggregates and related building materials.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Aathipatti",
        addressRegion: "Tamil Nadu",
        postalCode: "626101",
        addressCountry: "IN",
      },
      areaServed: ["Aruppukottai", "Virudhunagar District", "Madurai"],
    },
    {
      "@type": "ItemList",
      name: "Construction materials and JCB services available for enquiry",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": product.schemaType,
          name: product.name,
          description: product.detail,
          image: `${siteUrl}${product.image}`,
          brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        },
      })),
    },
  ],
};

export default function Home() {
  const whatsappUrl = whatsappEnquiryUrl(
    "Hello RVKumar Traders, I would like to enquire about construction materials.",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader overlay />
      <main className="home-main">
        <section className="hero-section">
          <div className="container hero-frame">
            <div className="hero-copy">
              <div className="eyebrow">
                <span /> Construction materials · Aruppukottai
              </div>
              <h1>
                <span>Build it better.</span>
                <em>Build it stronger.</em>
              </h1>
              <p className="hero-lead">
                Reliable materials, clear quotations and coordinated delivery for homes,
                contractors and building projects across our reviewed service area.
              </p>
              <div className="hero-actions">
                <Link href="/enquiry" className="button button-large">
                  Get a quote <ArrowRight size={19} />
                </Link>
                <Link href="/products" className="button button-secondary">
                  Explore materials <ChevronRight size={18} />
                </Link>
              </div>
            </div>
            <div className="hero-cinematic-image">
              <Image
                src="/images/golden-hour-construction-hero.webp"
                alt="Multi-storey concrete building under construction with tower cranes at golden hour"
                fill
                priority
                quality={75}
                sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 64px), 1320px"
              />
              <div className="hero-image-caption">
                <span>Project-ready supply</span>
                <strong>Materials coordinated around your requirement.</strong>
              </div>
            </div>
          </div>
          <div className="container trust-strip" aria-label="Business highlights">
            <div>
              <ShieldCheck />
              <span>
                <b>Clear process</b>
                <small>Enquiry before order</small>
              </span>
            </div>
            <div>
              <PackageCheck />
              <span>
                <b>Multiple materials</b>
                <small>One requirement list</small>
              </span>
            </div>
            <div>
              <Truck />
              <span>
                <b>Delivery review</b>
                <small>Checked by location</small>
              </span>
            </div>
            <div>
              <BadgeCheck />
              <span>
                <b>GST registered</b>
                <small>Details on formal documents</small>
              </span>
            </div>
          </div>
        </section>

        <section className="section products-section" id="products">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <span className="section-kicker">Products &amp; services</span>
                <h2>
                  Materials for every
                  <br />
                  stage of the build.
                </h2>
              </div>
              <p>
                Explore construction materials and JCB earthmoving services, then add
                what you need to a single enquiry. Specifications and availability are
                confirmed during review.
              </p>
            </div>
            <div className="product-grid">
              {products.slice(0, 5).map(({ name, detail, image, alt, imageClass }) => (
                <InteractiveProductCard
                  key={name}
                  name={name}
                  detail={detail}
                  image={image}
                  alt={alt}
                  imageClass={imageClass}
                />
              ))}
            </div>
            <div className="product-grid-footer">
              <p>Explore every available material, specification and enquiry option.</p>
              <Link href="/products" className="text-link">
                View all materials <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="section-kicker light">A straightforward process</span>
              <h2>
                From your material list
                <br />
                to a confirmed delivery.
              </h2>
            </div>
            <div className="process-grid">
              {steps.map((step) => (
                <article className="process-step" key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
            <div className="process-note">
              <ClipboardList size={21} />
              <p>
                <b>Your enquiry is not an order.</b> We create an order only after you
                review and accept a quotation.
              </p>
            </div>
          </div>
        </section>

        <section className="section real-work-section" id="operations">
          <div className="container">
            <div className="section-heading split-heading real-work-heading">
              <div>
                <span className="section-kicker">Real operations</span>
                <h2>Equipment and delivery support for site requirements.</h2>
              </div>
              <p>
                View real RVKumar Traders operating footage. Equipment availability,
                transport capacity, destination and scheduling are confirmed after we
                review your enquiry.
              </p>
            </div>
            <div className="operations-grid">
              <article className="operation-card">
                <video
                  controls
                  muted
                  playsInline
                  preload="none"
                  poster="/media/rvkumar-earthmovers-poster.webp"
                  aria-label="RVKumar Earthmovers excavation footage"
                >
                  <source src="/media/rvkumar-earthmovers.mp4" type="video/mp4" />
                </video>
                <div>
                  <span>Earthmoving service</span>
                  <h3>Excavation and site work</h3>
                  <p>
                    Share the work location and requirement so equipment suitability and
                    scheduling can be reviewed.
                  </p>
                </div>
              </article>
              <article className="operation-card">
                <video
                  controls
                  muted
                  playsInline
                  preload="none"
                  poster="/media/rvkumar-lorry-service-poster.webp"
                  aria-label="RVKumar lorry service footage"
                >
                  <source src="/media/rvkumar-lorry-service.mp4" type="video/mp4" />
                </video>
                <div>
                  <span>Material transport</span>
                  <h3>Lorry delivery coordination</h3>
                  <p>
                    Transport arrangements depend on material, quantity, access and the
                    confirmed delivery location.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section delivery-section" id="delivery">
          <div className="container delivery-grid">
            <div className="delivery-image">
              <Image
                src="/media/rvkumar-lorry-service-poster.webp"
                alt="RVKumar Traders lorry used for construction material delivery coordination"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="delivery-copy">
              <span className="section-kicker">Delivery coverage</span>
              <h2>Tell us where the material needs to reach.</h2>
              <p>
                Delivery availability depends on the material, quantity and destination.
                Share your PIN code in the enquiry and we will confirm what can be
                arranged.
              </p>
              <div className="area-list">
                <div>
                  <span>01</span>
                  <p>
                    <b>Aathipatti</b>
                    <small>Primary business location</small>
                  </p>
                </div>
                <div>
                  <span>02</span>
                  <p>
                    <b>Aruppukottai Taluk</b>
                    <small>Subject to requirement review</small>
                  </p>
                </div>
                <div>
                  <span>03</span>
                  <p>
                    <b>Virudhunagar &amp; Madurai</b>
                    <small>Exact coverage to be confirmed</small>
                  </p>
                </div>
              </div>
              <Link href="#quote" className="text-link dark-link">
                Check your location <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section quote-section" id="quote">
          <div className="container quote-panel">
            <div className="quote-copy">
              <span className="section-kicker light">Start your enquiry</span>
              <h2>
                Have a material list?
                <br />
                Let&apos;s review it.
              </h2>
              <p>
                Use the working multi-product form to send quantities, destination and
                preferred delivery date. Your request receives a unique reference and
                does not create an order automatically.
              </p>
              <div className="quote-contact-notice">
                <MessageCircle size={20} />
                <span>
                  {whatsappUrl
                    ? "Prefer WhatsApp? Use the verified business link to discuss your requirement."
                    : "Submit the form and the business will review your requirement before discussing commercial details."}
                </span>
              </div>
            </div>
            <div className="quote-preview" aria-label="Quotation request preview">
              <div className="preview-head">
                <div>
                  <small>Quotation request</small>
                  <b>Project material list</b>
                </div>
                <ClipboardList />
              </div>
              <div className="preview-row">
                <span className="check-box">
                  <Check size={14} />
                </span>
                <div>
                  <b>Select materials</b>
                  <small>Add more than one product</small>
                </div>
              </div>
              <div className="preview-row">
                <span className="check-box">
                  <Check size={14} />
                </span>
                <div>
                  <b>Add quantities</b>
                  <small>Choose suitable units</small>
                </div>
              </div>
              <div className="preview-row">
                <span className="check-box">
                  <Check size={14} />
                </span>
                <div>
                  <b>Share delivery PIN code</b>
                  <small>Help us review availability</small>
                </div>
              </div>
              <Link className="button button-large" href="/enquiry">
                Open quotation form <ArrowRight size={18} />
              </Link>
              <small className="preview-footnote">
                No payment required to submit an enquiry.
              </small>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faqs">
          <div className="container faq-grid">
            <div className="faq-intro">
              <span className="section-kicker">Common questions</span>
              <h2>Before you send your requirement.</h2>
              <p>Clear answers about how the quotation process works.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.q} open={index === 0}>
                  <summary>
                    <span>{faq.q}</span>
                    <span className="faq-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mobile-actions" aria-label="Quick actions">
          {publicContact.phone ? (
            <a href={`tel:${publicContact.phone}`}>
              <Phone size={18} /> Call
            </a>
          ) : (
            <Link href="/contact">
              <Phone size={18} /> Contact
            </Link>
          )}
          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          ) : (
            <Link href="/enquiry">
              <MessageCircle size={18} /> Enquire
            </Link>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
