"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/journeys",     label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about",        label: "Our Story" },
  { href: "/journal",      label: "Journal" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll to toggle between transparent (hero) and solid (scrolled)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  // Home page: transparent over hero, solid navy when scrolled
  // Internal pages: always solid navy
  const isDark = !isHome || scrolled || mobileOpen;

  const navBg = isHome && !scrolled && !mobileOpen
    ? "bg-transparent"
    : "bg-navy border-b border-white/10";

  const logoSrc = isDark
    ? "/logos/CE_Horizontal_NB_1200x400.svg"
    : "/homepage-draft/9cf76b02ac6a6a86dfb8ce66b57c03f6a861ab1a.png";

  const linkColor = "text-cream/60 hover:text-cream";
  const activeLinkColor = "text-cream";
  const ctaColor = "text-gold border-gold/60 hover:bg-gold/10";
  const isTransparentHome = isHome && !scrolled && !mobileOpen;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
      <div className={`max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between ${
        isTransparentHome ? "h-[82px]" : "h-16 sm:h-24"
      }`}>

        {/* Logo — larger, proper proportion */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src={logoSrc}
            alt="Curated Experiences"
            width={isDark ? 440 : 295}
            height={isDark ? 146 : 40}
            className={`w-auto transition-all duration-300 ${
              isTransparentHome ? "h-10" : "h-10 sm:h-22"
            }`}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-300 ${
                pathname.startsWith(link.href) ? activeLinkColor : linkColor
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isTransparentHome ? (
            <>
              <a
                href="tel:0800287283"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-cream"
                aria-label="Call 0800 CURATE"
                title="Call 0800 CURATE"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                0800 CURATE
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
                className="text-xs font-medium uppercase tracking-[0.15em] text-gold transition-colors duration-300 hover:text-cream"
              >
                Enquire
              </button>
            </>
          ) : (
            <>
              <a
                href="tel:0800287283"
                className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${linkColor}`}
                aria-label="Call 0800 CURATE"
                title="Call 0800 CURATE"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                0800 CURATE
              </a>

              <button
                onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
                className={`px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium border transition-colors duration-300 ${ctaColor}`}
              >
                Start Planning
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-cream transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7"  x2="20" y2="7"  />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — always navy */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-8 space-y-5">
          <Image
            src="/logos/CE_Horizontal_NB_1200x400.svg"
            alt="Curated Experiences"
            width={180}
            height={60}
            className="h-9 w-auto mb-6"
          />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block font-serif text-2xl tracking-tight ${
                pathname.startsWith(link.href) ? "text-cream" : "text-cream/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              window.dispatchEvent(new Event("ce:open-concierge"));
            }}
            className="mt-6 w-full px-5 py-3.5 text-xs tracking-[0.2em] uppercase font-medium
              text-gold border border-gold/60 hover:bg-gold/10 transition-colors"
          >
            Start Planning
          </button>
        </div>
      )}
    </nav>
  );
}
