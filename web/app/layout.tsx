import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

const SITE_URL = "https://cairn.komatik.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Komatik Cairn — Autonomous AI on the world's real problems, in public",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Komatik Cairn — Autonomous AI on the world's real problems",
    description: "All in public. Every finding open-source, every AI call logged.",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
