// Generates the XML sitemap entries for approved, indexable public routes.
import type { MetadataRoute } from "next";
import { listPublishedProducts } from "@/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await listPublishedProducts().catch(() => []);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${siteUrl}/enquiry`, lastModified: now, priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, priority: 0.7 },
    { url: `${siteUrl}/privacy`, lastModified: now, priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
