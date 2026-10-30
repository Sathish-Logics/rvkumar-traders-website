// Renders the reusable public-site header, responsive navigation, and enquiry actions.
"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { whatsappEnquiryUrl } from "@/lib/public-contact";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "How it works", href: "/#process" },
  { label: "Delivery areas", href: "/#delivery" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappUrl = whatsappEnquiryUrl(
    "Hello RVKumar Traders, I would like to enquire about construction materials.",
  );

  return (
    <header className={`site-header${overlay ? " site-header-overlay" : ""}`}>
      <div className="container nav-shell">
        <Link href="/" className="brand" aria-label="RVKumar Traders home">
          <span className="brand-logo-shell">
            <Image
              className="brand-logo"
              src="/images/rv-kumar-traders-logo-transparent.webp"
              alt="RV Kumar Traders logo"
              width={720}
              height={685}
              priority
            />
          </span>
          <span className="brand-name">
            RVKumar <b>Traders</b>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {whatsappUrl ? (
            <a
              className="button button-small"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp <MessageCircle size={16} aria-hidden="true" />
            </a>
          ) : (
            <Link className="button button-small" href="/enquiry">
              Get a quote <MessageCircle size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
        <button
          className="menu-button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        className={`mobile-nav${isMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="container mobile-nav-inner">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link
            className="button button-small"
            href="/enquiry"
            onClick={() => setIsMenuOpen(false)}
          >
            Request quote <MessageCircle size={17} aria-hidden="true" />
          </Link>
          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp enquiry
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
