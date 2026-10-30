// Renders the reusable public-site footer, business location, and legal links.
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { publicContact, whatsappEnquiryUrl } from "@/lib/public-contact";

export function SiteFooter() {
  const whatsappUrl = whatsappEnquiryUrl(
    "Hello RVKumar Traders, I would like to enquire about construction materials.",
  );
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand brand-inverse">
            <span className="brand-logo-shell brand-logo-shell-footer">
              <Image
                className="brand-logo"
                src="/images/rv-kumar-traders-logo-transparent.webp"
                alt="RV Kumar Traders logo"
                width={720}
                height={685}
              />
            </span>
            <span className="brand-name">
              RVKumar <b>Traders</b>
            </span>
          </div>
          <p>
            Construction materials supplied through a clear enquiry and quotation
            process.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/#process">How it works</Link>
            <Link href="/#delivery">Delivery areas</Link>
            <Link href="/enquiry">Request quotation</Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Business location</p>
          <p className="footer-address">
            <MapPin size={18} aria-hidden="true" />
            <span>
              Aathipatti, Aruppukottai Taluk
              <br />
              Tamil Nadu 626101
            </span>
          </p>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          {publicContact.phone ? (
            <p className="footer-muted">{publicContact.phone}</p>
          ) : null}
          {publicContact.email ? (
            <p className="footer-muted">{publicContact.email}</p>
          ) : null}
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              className="footer-cta"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp enquiry <ArrowUpRight size={16} />
            </a>
          ) : (
            <Link href="/enquiry" className="footer-cta">
              Start an enquiry <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} RVKumar Traders. All rights reserved.</p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
