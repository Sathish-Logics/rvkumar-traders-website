// Renders one SEO-friendly product detail page from its database-backed slug.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/Header";
import { getPublishedProduct } from "@/services/product.service";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} in Aruppukottai`,
    description: `${product.description} Request availability and delivery details from RVKumar Traders in Aathipatti, Aruppukottai Taluk.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | RVKumar Traders`,
      description: product.description,
      url: `/products/${product.slug}`,
      images: [{ url: product.imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/products/${product.slug}#product`,
        name: product.name,
        description: product.description,
        image: `${siteUrl}${product.imageUrl}`,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${siteUrl}/products/${product.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main className="product-detail-page">
        <div className="container product-detail-grid">
          <div className="product-detail-image">
            <Image
              src={product.imageUrl}
              alt={`${product.name} supplied by RVKumar Traders`}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <article>
            <span className="section-kicker">
              {product.brand ?? "Construction material"}
            </span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <dl>
              <div>
                <dt>Standard unit</dt>
                <dd>{product.unit}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>
                  {product.isAvailable
                    ? "Available for enquiry"
                    : "Temporarily unavailable"}
                </dd>
              </div>
            </dl>
            <Link
              className="button button-large"
              href={`/enquiry?product=${product.slug}`}
            >
              Request quotation
            </Link>
            <p className="form-note">
              Price and delivery details are confirmed after reviewing quantity and
              location.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
