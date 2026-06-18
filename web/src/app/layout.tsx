import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/format";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — sourced catalog of campus continuity of operations plans`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: [
    "continuity of operations",
    "COOP",
    "business continuity",
    "higher education",
    "college continuity plans",
    "university continuity plans",
    "FCD 1",
    "ISO 22301",
    "NFPA 1600",
    "NIST SP 800-34",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="container page">{children}</main>
        <SiteFooter />
        <CommandPalette />
      </body>
    </html>
  );
}
