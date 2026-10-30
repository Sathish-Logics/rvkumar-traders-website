// Defines the root HTML layout, global fonts, styles, and site-wide SEO metadata.
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jost";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./public-redesign.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RVKumar Traders | Construction Materials",
    template: "%s | RVKumar Traders",
  },
  description:
    "Request a quotation for construction materials from RVKumar Traders, serving Aathipatti, Aruppukottai Taluk and surrounding verified service areas.",
  applicationName: "RVKumar Traders",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RVKumar Traders",
    title: "Construction materials for your next build",
    description: "Tell us what your project needs and request a material quotation.",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
