"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/browse/", label: "Browse" },
  { href: "/chapters/", label: "Chapters" },
  { href: "/statistics/", label: "Statistics" },
  { href: "/benchmark/", label: "Benchmark" },
  { href: "/downloads/", label: "Download" },
  { href: "/about/", label: "About" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));
  const openSearch = () => {
    setOpen(false);
    window.dispatchEvent(new Event("open-cmdk"));
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-semibold tracking-tight text-text-primary hover:no-underline"
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-md text-[0.6rem] font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--violet))" }}
          >
            COOP
          </span>
          <span className="hidden sm:inline">Campus COOP Archive</span>
          <span className="sm:hidden">COOP Archive</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(n.href)
                  ? "bg-accent-light text-accent-ink"
                  : "text-text-secondary hover:bg-cream-dark hover:text-text-primary"
              )}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={openSearch}
            aria-label="Search the Archive"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Search
            <kbd className="rounded border border-border bg-cream-dark px-1 py-px font-mono text-[0.65rem]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            onClick={openSearch}
            aria-label="Search the Archive"
            className="touch-target inline-flex items-center justify-center rounded-md p-2 text-text-secondary"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="touch-target inline-flex items-center justify-center rounded-md p-2 text-text-secondary"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface md:hidden">
          <div className="mx-auto max-w-[1180px] px-3 py-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive(n.href) ? "bg-accent-light text-accent-ink" : "text-text-body"
                )}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
