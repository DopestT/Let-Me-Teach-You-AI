import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://letmeteachyouai.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Learn AI, one clear step at a time`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A beginner-friendly AI newsletter. We all got hit with AI at the same time — here's what actually works, taught plainly. Free 25-prompt starter pack when you join.",
  keywords: [
    "learn AI",
    "AI for beginners",
    "AI newsletter",
    "ChatGPT prompts",
    "AI prompts",
    "AI education",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Learn AI, one clear step at a time`,
    description:
      "Practical, beginner-friendly AI lessons. Join free and get 25 prompts you can use today.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Learn AI, one clear step at a time`,
    description:
      "Practical, beginner-friendly AI lessons. Join free and get 25 prompts you can use today.",
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
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
