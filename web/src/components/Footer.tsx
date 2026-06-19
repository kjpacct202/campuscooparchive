import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/format";

const COLS: { heading: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    heading: "Browse",
    links: [
      { href: "/browse/", label: "Browse plans" },
      { href: "/search/", label: "Search" },
      { href: "/compare/", label: "Compare" },
      { href: "/institutions/", label: "Institutions" },
      { href: "/chapters/", label: "Chapters" },
      { href: "/statistics/", label: "Statistics" },
    ],
  },
  {
    heading: "Understand",
    links: [
      { href: "/benchmark/", label: "The 22-component benchmark" },
      { href: "/insights/", label: "Insights" },
      { href: "/wisdom/", label: "Wisdom" },
      { href: "/methodology/", label: "Methodology" },
      { href: "/downloads/", label: "Download the data" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about/", label: "About" },
      { href: "/contribute/", label: "How it's built" },
      { href: "/contact/", label: "Contact" },
      { href: "/accessibility/", label: "Accessibility" },
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="grid gap-10 py-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-semibold tracking-tight text-text-primary">
              <span
                className="grid h-7 w-7 place-items-center rounded-md text-[0.6rem] font-extrabold text-white"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--violet))" }}
              >
                COOP
              </span>
              Campus COOP Archive
            </div>
            <p className="mt-3 max-w-[42ch] text-sm text-text-secondary">
              {SITE_TAGLINE} Every record links to its primary source and a verbatim evidence quote.
              A sister project to the{" "}
              <a
                href="https://campusalertarchive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                Campus Alert Archive
              </a>
              .
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-text-muted">
                {col.heading}
              </h4>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-text-secondary hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border py-6 text-xs leading-relaxed text-text-muted">
          Source documents remain the work of their respective institutions and are linked, not
          redistributed. This is a research index and analysis layer over publicly available
          material. AI-assisted compilation.
        </div>
      </div>
    </footer>
  );
}
