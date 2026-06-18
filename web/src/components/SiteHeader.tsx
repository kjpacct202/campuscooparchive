"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/browse/", label: "Browse" },
  { href: "/chapters/", label: "Chapters" },
  { href: "/wisdom/", label: "Wisdom" },
  { href: "/benchmark/", label: "Benchmark" },
  { href: "/downloads/", label: "Download" },
  { href: "/about/", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));
  const openSearch = () => {
    setOpen(false);
    window.dispatchEvent(new Event("open-cmdk"));
  };

  return (
    <header className="site-header">
      <div className="container bar">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="mark">COOP</span> Campus COOP Archive
        </Link>

        <nav className="site-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isActive(n.href) ? "active" : undefined}>
              {n.label}
            </Link>
          ))}
          <button className="kbd-btn" aria-label="Open search" onClick={openSearch}>
            Search <kbd>&#8984;K</kbd>
          </button>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className="mobile-nav">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={isActive(n.href) ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <button className="mobile-search" onClick={openSearch}>
            Search the Archive &#8984;K
          </button>
        </nav>
      )}
    </header>
  );
}
