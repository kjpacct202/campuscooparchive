"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds .reveal-ready to <html> and reveals [data-reveal] elements on scroll.
 * Re-scans on route change. No-ops under prefers-reduced-motion. */
export default function RevealController() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const id = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
      if (reduce || !("IntersectionObserver" in window)) {
        els.forEach((e) => e.classList.add("is-visible"));
        return;
      }
      root.classList.add("reveal-ready");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible");
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );
      els.forEach((e) => io.observe(e));
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
}
