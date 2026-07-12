import Link from "next/link";
import { Sparkles } from "lucide-react";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Let Me Teach You AI";

export function SiteHeader() {
  return (
    <header className="border-b border-[--color-line] bg-[--color-cream]/80 backdrop-blur supports-[backdrop-filter]:bg-[--color-cream]/60 sticky top-0 z-40">
      <div className="container-editorial flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-editorial text-lg font-semibold text-[--color-navy]"
        >
          <Sparkles className="h-5 w-5 text-[--color-gold]" aria-hidden />
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-[--color-navy-600]">
          <Link href="/#lessons" className="hidden sm:inline hover:text-[--color-brand]">
            What you'll learn
          </Link>
          <Link href="/contact" className="hidden sm:inline hover:text-[--color-brand]">
            Contact
          </Link>
          <Link
            href="/#join"
            className="rounded-full bg-[--color-brand] px-4 py-2 text-white transition-colors hover:bg-[--color-brand-dark]"
          >
            Join free
          </Link>
        </nav>
      </div>
    </header>
  );
}
