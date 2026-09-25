import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const SITE_URL = "https://www.letmeteachyouai.com";
const SITE_NAME = "Let Me Teach You AI";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Learn AI, one clear step at a time`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Practical AI education built around real outcomes. Get the free AI Work Kit: 25 prompts, 5 workflows, a tool cheat sheet, and a 10-minute quick start.",
  keywords: [
    "learn AI",
    "AI for beginners",
    "AI newsletter",
    "ChatGPT prompts",
    "AI prompts",
    "AI education",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    url: "./",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Learn AI, one clear step at a time`,
    description:
      "Stop collecting prompts. Get the free AI Work Kit and start using AI like a coworker.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Let Me Teach You AI — learn AI by building useful things",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Learn AI, one clear step at a time`,
    description:
      "Stop collecting prompts. Get the free AI Work Kit and start using AI like a coworker.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
