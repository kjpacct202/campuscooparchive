"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Sticky on-this-page nav. Auto-discovers the <h2> section headings inside the
 * main content (assigning ids as needed) and highlights the active one on
 * scroll. Renders nothing if there are fewer than two sections. */
export default function JumpNav() {
  const pathname = usePathname();
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLHeadingElement>("#main-content h2"));
    const found = heads.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || "");
      h.style.scrollMarginTop = "76px";
      return { id: h.id, text: (h.textContent || "").trim() };
    }).filter((i) => i.text && i.id);
    if (found.length < 2) {
      setItems([]);
      return;
    }
    setItems(found);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [pathname]);

  if (items.length < 2) return null;
  return (
    <nav className="jumpnav" aria-label="On this page">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={active === i.id ? "active" : undefined}>
          {i.text}
        </a>
      ))}
    </nav>
  );
}
