"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "Our Story" },
  { href: "/journal", label: "Journal" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-warm-200/50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/curated-experiences.png"
            alt="Curated Experiences"
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-navy font-medium"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() =>
              window.dispatchEvent(new Event("ce:open-concierge"))
            }
            className="px-5 py-2.5 text-sm tracking-wide bg-navy text-white
              rounded-lg hover:bg-navy-light transition-colors"
          >
            Start Planning
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-warm-200/50 px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-lg font-serif ${
                pathname.startsWith(link.href)
                  ? "text-navy"
                  : "text-foreground-muted"
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
            className="w-full mt-4 px-5 py-3 text-sm tracking-wide bg-navy text-white
              rounded-lg hover:bg-navy-light transition-colors text-center"
          >
            Start Planning
          </button>
        </div>
      )}
    </nav>
  );
}
