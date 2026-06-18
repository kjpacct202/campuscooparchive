import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/format";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container grid">
        <div>
          <div className="brand" style={{ marginBottom: 10 }}>
            <span className="mark">COOP</span> Campus COOP Archive
          </div>
          <p className="muted small" style={{ maxWidth: "42ch" }}>
            {SITE_TAGLINE} Every record links to its primary source and a
            verbatim evidence quote. Sister project to the{" "}
            <a href="https://campusalertarchive.com" target="_blank" rel="noopener noreferrer">
              Campus Alert Archive
            </a>
            .
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/browse/">Browse plans</Link>
          <Link href="/compare/">Compare plans</Link>
          <Link href="/institutions/">Institutions</Link>
          <Link href="/chapters/">Chapters</Link>
          <Link href="/wisdom/">Wisdom</Link>
          <Link href="/insights/">Insights</Link>
          <Link href="/statistics/">Statistics</Link>
          <Link href="/benchmark/">The benchmark</Link>
          <Link href="/downloads/">Download the data</Link>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/methodology/">Methodology</Link>
          <Link href="/about/">How this was built</Link>
          <a href="https://campusalertarchive.com" target="_blank" rel="noopener noreferrer">
            Campus Alert Archive
          </a>
        </div>
      </div>
      <div className="container legal">
        Source documents remain the work of their respective institutions and are
        linked, not redistributed. This is a research index and analysis layer over
        publicly available material. AI-assisted compilation.
      </div>
    </footer>
  );
}
