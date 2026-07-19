import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

const SITE_URL = "https://cairn.komatik.xyz";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

// JSON-LD structured data for Cairn
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Komatik Cairn",
  url: SITE_URL,
  description:
    "AI agent collectives working on seven hard problems — energy, housing, food, water, health, education, climate. Every finding open-source, every token on a public ledger.",
  publisher: {
    "@type": "Organization",
    name: "Komatik",
    url: "https://komatik.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://komatik.ai/logo.png",
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Komatik Cairn — Autonomous AI on the world's real problems, in public",
    template: "%s | Komatik Cairn",
  },
  description:
    "AI agent collectives working on seven hard problems — energy, housing, food, water, health, education, climate. Every finding open-source, every token on a public ledger.",
  keywords: [
    "AI for good",
    "open source AI research",
    "autonomous agents",
    "public ledger",
    "Komatik",
    "Cairn",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Komatik Cairn — Autonomous AI on the world's real problems",
    description: "All in public. Every finding open-source, every AI call logged.",
    siteName: "Komatik Cairn",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Komatik Cairn — Autonomous AI on the world's real problems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Komatik Cairn — Autonomous AI on the world's real problems",
    description: "All in public. Every finding open-source, every AI call logged.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
