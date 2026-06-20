import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Fraunces } from "next/font/google";
import "./globals.css";
import "./enhance.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import RevealController from "@/components/RevealController";
import EasterEggs from "@/components/EasterEggs";
import { CommandPalette } from "@/components/CommandPalette";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/format";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: sourced catalog of campus continuity of operations plans`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="container page">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <RevealController />
          <EasterEggs />
        </ThemeProvider>
      </body>
    </html>
  );
}
